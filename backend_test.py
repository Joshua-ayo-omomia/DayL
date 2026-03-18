import requests
import sys
import json
from datetime import datetime
import time

class DayLearningAPITester:
    def __init__(self, base_url="https://enterprise-dashboard-11.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.admin_token = None
        self.student_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        
        # Test data
        self.test_email = f"test_user_{datetime.now().strftime('%H%M%S')}@example.com"
        self.admin_email = "admin@daylearning.com"
        self.admin_password = "admin123"

    def log_test(self, name, success, details="", error=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {error}")
        
        self.test_results.append({
            "name": name,
            "success": success,
            "details": details,
            "error": error
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, files=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        if self.admin_token and 'Authorization' not in test_headers:
            test_headers['Authorization'] = f'Bearer {self.admin_token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                if files:
                    # Remove Content-Type for multipart/form-data
                    test_headers.pop('Content-Type', None)
                    response = requests.post(url, data=data, files=files, headers=test_headers)
                else:
                    response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            
            if success:
                try:
                    response_data = response.json()
                    self.log_test(name, True, f"Status: {response.status_code}")
                    return True, response_data
                except:
                    self.log_test(name, True, f"Status: {response.status_code} (No JSON)")
                    return True, {}
            else:
                try:
                    error_data = response.json()
                    error_msg = error_data.get('detail', f"Status: {response.status_code}")
                except:
                    error_msg = f"Status: {response.status_code}"
                
                self.log_test(name, False, "", error_msg)
                return False, {}

        except Exception as e:
            self.log_test(name, False, "", str(e))
            return False, {}

    def test_health_endpoints(self):
        """Test basic health endpoints"""
        print("\n🔍 Testing Health Endpoints...")
        
        self.run_test("API Root", "GET", "", 200)
        self.run_test("Health Check", "GET", "health", 200)

    def test_admin_authentication(self):
        """Test admin login"""
        print("\n🔍 Testing Admin Authentication...")
        
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"email": self.admin_email, "password": self.admin_password}
        )
        
        if success and 'token' in response:
            self.admin_token = response['token']
            print(f"   Admin token obtained: {self.admin_token[:20]}...")
            
            # Test protected admin endpoint
            self.run_test("Admin Analytics", "GET", "admin/analytics", 200)
            return True
        else:
            print("   ❌ Failed to get admin token")
            return False

    def test_seed_data(self):
        """Test seed data creation"""
        print("\n🔍 Testing Seed Data...")
        
        self.run_test("Create Seed Data", "POST", "seed", 200)

    def test_tracks_and_modules(self):
        """Test tracks and modules endpoints"""
        print("\n🔍 Testing Tracks and Modules...")
        
        success, tracks = self.run_test("Get Tracks", "GET", "tracks", 200)
        if success and tracks:
            track_id = tracks[0]['id'] if tracks else None
            print(f"   Found {len(tracks)} tracks")
            
            if track_id:
                self.run_test("Get Single Track", "GET", f"tracks/{track_id}", 200)
        
        success, modules = self.run_test("Get Modules", "GET", "modules", 200)
        if success and modules:
            print(f"   Found {len(modules)} modules")
            
            if modules:
                module_id = modules[0]['id']
                self.run_test("Get Single Module", "GET", f"modules/{module_id}", 200)

    def test_application_flow(self):
        """Test application submission and management"""
        print("\n🔍 Testing Application Flow...")
        
        # Test application submission
        app_data = {
            "full_name": "Test User",
            "email": self.test_email,
            "phone": "+1234567890",
            "linkedin_url": "https://linkedin.com/in/testuser",
            "brief": "I am a software engineer with 3 years of experience in Python and JavaScript. I have built several web applications and want to learn AI engineering.",
            "why_join": "I want to enhance my skills with AI to build better applications and advance my career.",
            "experience_years": "3-5",
            "skill_area": "Full Stack",
            "commitment": "true"
        }
        
        # Submit application using form data
        try:
            url = f"{self.base_url}/applications"
            response = requests.post(url, data=app_data)
            
            if response.status_code == 200:
                app_response = response.json()
                self.log_test("Submit Application", True, f"Status: {response.status_code}")
                success = True
            else:
                try:
                    error_data = response.json()
                    error_msg = error_data.get('detail', f"Status: {response.status_code}")
                except:
                    error_msg = f"Status: {response.status_code}"
                self.log_test("Submit Application", False, "", error_msg)
                success = False
                app_response = {}
        except Exception as e:
            self.log_test("Submit Application", False, "", str(e))
            success = False
            app_response = {}
        
        if success and 'id' in app_response:
            app_id = app_response['id']
            print(f"   Application created with ID: {app_id}")
            
            # Test admin viewing applications
            success, applications = self.run_test("Get Applications (Admin)", "GET", "applications", 200)
            if success:
                print(f"   Admin can see {len(applications)} applications")
            
            # Test AI screening
            print("   Testing AI screening (this may take a few seconds)...")
            success, screen_result = self.run_test(
                "AI Screen Application",
                "POST",
                f"applications/{app_id}/screen",
                200
            )
            
            if success:
                print("   ✅ AI screening completed successfully")
                
                # Test application approval
                success, approval = self.run_test(
                    "Approve Application",
                    "POST",
                    f"applications/{app_id}/approve",
                    200
                )
                
                if success and 'invitation_code' in approval:
                    invitation_code = approval['invitation_code']
                    print(f"   Application approved with code: {invitation_code}")
                    return app_id, invitation_code
            else:
                print("   ⚠️  AI screening failed, trying approval anyway...")
                success, approval = self.run_test(
                    "Approve Application (without AI)",
                    "POST",
                    f"applications/{app_id}/approve",
                    200
                )
                if success and 'invitation_code' in approval:
                    return app_id, approval['invitation_code']
        
        return None, None

    def test_student_registration_and_onboarding(self, invitation_code):
        """Test student registration and onboarding"""
        if not invitation_code:
            print("\n⚠️  Skipping student tests - no invitation code")
            return None
            
        print("\n🔍 Testing Student Registration and Onboarding...")
        
        # Test student registration
        student_data = {
            "email": self.test_email,
            "password": "TestPassword123!",
            "name": "Test Student",
            "invitation_code": invitation_code
        }
        
        success, reg_response = self.run_test(
            "Student Registration",
            "POST",
            "auth/register",
            200,
            data=student_data
        )
        
        if success and 'token' in reg_response:
            self.student_token = reg_response['token']
            print(f"   Student registered with token: {self.student_token[:20]}...")
            
            # Test onboarding items
            onboarding_items = ["code_of_conduct", "how_it_works", "dev_environment", "join_community", "confirm_commitment"]
            
            for item in onboarding_items:
                self.run_test(
                    f"Complete Onboarding: {item}",
                    "PUT",
                    f"onboarding/item/{item}",
                    200,
                    headers={'Authorization': f'Bearer {self.student_token}'}
                )
            
            # Check onboarding status
            self.run_test(
                "Get Onboarding Status",
                "GET",
                "onboarding/status",
                200,
                headers={'Authorization': f'Bearer {self.student_token}'}
            )
            
            return self.student_token
        
        return None

    def test_student_progress_and_submissions(self, student_token):
        """Test student progress and submission system"""
        if not student_token:
            print("\n⚠️  Skipping progress tests - no student token")
            return
            
        print("\n🔍 Testing Student Progress and Submissions...")
        
        # Get student progress
        success, progress = self.run_test(
            "Get Student Progress",
            "GET",
            "progress",
            200,
            headers={'Authorization': f'Bearer {student_token}'}
        )
        
        if success and progress:
            print(f"   Student has progress on {len(progress)} modules")
            
            # Find an available module
            available_module = None
            for prog in progress:
                if prog['status'] in ['available', 'in_progress']:
                    available_module = prog['module_id']
                    break
            
            if available_module:
                # Start module
                self.run_test(
                    "Start Module",
                    "POST",
                    f"progress/{available_module}/start",
                    200,
                    headers={'Authorization': f'Bearer {student_token}'}
                )
                
                # Test submission creation
                submission_data = {
                    "module_id": available_module,
                    "title": "Test Project Submission",
                    "description": "This is a test submission for the AI engineering module",
                    "project_url": "https://github.com/testuser/ai-project",
                    "notes": "This project demonstrates my understanding of the module concepts"
                }
                
                # Test submission creation using form data
                try:
                    url = f"{self.base_url}/submissions"
                    headers = {'Authorization': f'Bearer {student_token}'}
                    response = requests.post(url, data=submission_data, headers=headers)
                    
                    if response.status_code == 200:
                        sub_response = response.json()
                        self.log_test("Create Submission", True, f"Status: {response.status_code}")
                        success = True
                    else:
                        try:
                            error_data = response.json()
                            error_msg = error_data.get('detail', f"Status: {response.status_code}")
                        except:
                            error_msg = f"Status: {response.status_code}"
                        self.log_test("Create Submission", False, "", error_msg)
                        success = False
                        sub_response = {}
                except Exception as e:
                    self.log_test("Create Submission", False, "", str(e))
                    success = False
                    sub_response = {}
                
                if success and 'id' in sub_response:
                    submission_id = sub_response['id']
                    print(f"   Submission created with ID: {submission_id}")
                    
                    # Test admin reviewing submission
                    review_data = {
                        "status": "pass",
                        "admin_feedback": "Great work! Your project demonstrates a solid understanding of the concepts."
                    }
                    
                    self.run_test(
                        "Review Submission (Admin)",
                        "POST",
                        f"submissions/{submission_id}/review",
                        200,
                        data=review_data,
                        headers={'Authorization': f'Bearer {self.admin_token}'}
                    )

    def test_admin_management(self):
        """Test admin management endpoints"""
        print("\n🔍 Testing Admin Management...")
        
        self.run_test("Get All Students", "GET", "admin/students", 200)
        self.run_test("Get All Submissions", "GET", "submissions", 200)
        self.run_test("Get All Users", "GET", "admin/users", 200)

    def test_certificate_generation(self, student_token):
        """Test certificate generation"""
        if not student_token:
            print("\n⚠️  Skipping certificate tests - no student token")
            return
            
        print("\n🔍 Testing Certificate Generation...")
        
        # This will likely fail since student hasn't completed all modules
        success, cert_response = self.run_test(
            "Generate Certificate",
            "POST",
            "certificates/generate",
            400,  # Expecting 400 since modules aren't completed
            headers={'Authorization': f'Bearer {student_token}'}
        )
        
        # Get user certificates
        self.run_test(
            "Get User Certificates",
            "GET",
            "certificates",
            200,
            headers={'Authorization': f'Bearer {student_token}'}
        )

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Day Learning API Tests")
        print(f"Testing against: {self.base_url}")
        
        # Basic health checks
        self.test_health_endpoints()
        
        # Admin authentication
        if not self.test_admin_authentication():
            print("❌ Admin authentication failed - stopping tests")
            return self.generate_report()
        
        # Seed data
        self.test_seed_data()
        
        # Tracks and modules
        self.test_tracks_and_modules()
        
        # Application flow
        app_id, invitation_code = self.test_application_flow()
        
        # Student registration and onboarding
        student_token = self.test_student_registration_and_onboarding(invitation_code)
        
        # Student progress and submissions
        self.test_student_progress_and_submissions(student_token)
        
        # Admin management
        self.test_admin_management()
        
        # Certificate generation
        self.test_certificate_generation(student_token)
        
        return self.generate_report()

    def generate_report(self):
        """Generate final test report"""
        print(f"\n📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("❌ Some tests failed")
            failed_tests = [t for t in self.test_results if not t['success']]
            print("\nFailed tests:")
            for test in failed_tests:
                print(f"  - {test['name']}: {test['error']}")
            return 1

def main():
    tester = DayLearningAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())