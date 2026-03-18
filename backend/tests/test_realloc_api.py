"""
Realloc API Tests - Enterprise Workforce Reallocation Platform
Tests all API endpoints for enterprise dashboard, participant dashboard, and admin functions
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ENTERPRISE_ADMIN = {"email": "neil@sagicor.com", "password": "demo123"}
PARTICIPANT = {"email": "anna.chen@sagicor.com", "password": "demo123"}
SUPER_ADMIN = {"email": "ayo@realloc.ai", "password": "admin123"}
MENTOR = {"email": "marcus@realloc.ai", "password": "demo123"}


class TestHealthAndAuth:
    """Basic health and authentication tests"""
    
    def test_health_endpoint(self):
        """Test API health endpoint"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["platform"] == "Realloc"
        print("Health check passed: platform = Realloc")
    
    def test_login_enterprise_admin(self):
        """Test enterprise admin login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json=ENTERPRISE_ADMIN)
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["user"]["role"] == "enterprise_admin"
        assert data["user"]["enterprise_id"] is not None
        print(f"Enterprise admin login success: role={data['user']['role']}, enterprise_id={data['user']['enterprise_id']}")
    
    def test_login_participant(self):
        """Test participant login (anna.chen@sagicor.com)"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json=PARTICIPANT)
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["user"]["role"] == "participant"
        assert data["user"]["cohort_id"] is not None
        assert data["user"]["personalized_track_name"] == "AI-Powered Application Modernization"
        print(f"Participant login success: {data['user']['name']}, track={data['user']['personalized_track_name']}")
    
    def test_login_mentor(self):
        """Test mentor login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json=MENTOR)
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["user"]["role"] == "mentor"
        print(f"Mentor login success: {data['user']['name']}")
    
    def test_login_invalid_credentials(self):
        """Test login with wrong credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={"email": "wrong@test.com", "password": "wrong"})
        assert response.status_code == 401


class TestEnterpriseDashboard:
    """Enterprise dashboard and heatmap tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        login_res = requests.post(f"{BASE_URL}/api/auth/login", json=ENTERPRISE_ADMIN)
        data = login_res.json()
        self.token = data["token"]
        self.enterprise_id = data["user"]["enterprise_id"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_enterprise_dashboard(self):
        """Test enterprise dashboard returns 587 workers"""
        response = requests.get(f"{BASE_URL}/api/enterprise/{self.enterprise_id}/dashboard", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        # Check total workers
        assert data["stats"]["total_workers"] == 587, f"Expected 587 workers, got {data['stats']['total_workers']}"
        assert data["stats"]["countries"] == 6, f"Expected 6 countries, got {data['stats']['countries']}"
        
        # Check displacement distribution
        displacement = data["displacement"]
        total_disp = displacement["rising"] + displacement["stable"] + displacement["at_risk"]
        assert total_disp == 587, f"Displacement total should be 587, got {total_disp}"
        
        print(f"Enterprise dashboard: {data['stats']['total_workers']} workers, {data['stats']['countries']} countries")
        print(f"Displacement: Rising={displacement['rising']}, Stable={displacement['stable']}, At Risk={displacement['at_risk']}")
    
    def test_workforce_heatmap(self):
        """Test workforce heatmap returns all 587 workers"""
        response = requests.get(f"{BASE_URL}/api/enterprise/{self.enterprise_id}/heatmap", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        # Check we get all workers
        assert data["summary"]["total"] == 587
        assert data["summary"]["showing"] == 587
        assert len(data["workers"]) == 587
        
        # Check filter options exist
        assert len(data["filters"]["countries"]) > 0
        assert len(data["filters"]["departments"]) > 0
        
        print(f"Heatmap: {data['summary']['total']} total workers, {len(data['filters']['countries'])} countries, {len(data['filters']['departments'])} departments")
    
    def test_heatmap_filter_country(self):
        """Test heatmap filtering by country"""
        response = requests.get(f"{BASE_URL}/api/enterprise/{self.enterprise_id}/heatmap?country=Jamaica", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        # All workers should be from Jamaica
        assert data["summary"]["showing"] > 0
        for worker in data["workers"]:
            assert worker["country"] == "Jamaica"
        
        print(f"Jamaica filter: {data['summary']['showing']} workers")
    
    def test_heatmap_filter_category(self):
        """Test heatmap filtering by displacement category"""
        response = requests.get(f"{BASE_URL}/api/enterprise/{self.enterprise_id}/heatmap?category=rising", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        # All workers should have rising category
        assert data["summary"]["showing"] > 0
        for worker in data["workers"]:
            assert worker["displacement_category"] == "rising"
        
        print(f"Rising filter: {data['summary']['showing']} workers")
    
    def test_builder_core(self):
        """Test builder core returns top candidates"""
        response = requests.get(f"{BASE_URL}/api/enterprise/{self.enterprise_id}/builder-core", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        candidates = data["candidates"]
        assert len(candidates) >= 10, f"Expected at least 10 builder core candidates, got {len(candidates)}"
        
        # Check the top 10 have real names from seed data
        expected_names = ["Eugene McDermott", "Anna (YueHua) Chen", "Karen McCulloch", "Carol Blackwood", 
                        "Clarence Chai", "Aftab Siddiqi", "Ivan (Ho Wai) Tang", "Charis Pringle",
                        "Kelly Donnet", "Otis Kidd"]
        actual_names = [c["name"] for c in candidates[:10]]
        
        matching_names = [n for n in expected_names if n in actual_names]
        assert len(matching_names) >= 8, f"Expected most builder core candidates, found only {len(matching_names)} matches"
        
        print(f"Builder core: {len(candidates)} candidates")
        for c in candidates[:5]:
            print(f"  - {c['name']}: {c.get('builder_classification', 'N/A')}")
    
    def test_cohorts(self):
        """Test cohorts endpoint returns 4 cohorts"""
        response = requests.get(f"{BASE_URL}/api/enterprise/{self.enterprise_id}/cohorts", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        cohorts = data["cohorts"]
        assert len(cohorts) == 4, f"Expected 4 cohorts, got {len(cohorts)}"
        
        # Check cohort 1 is active
        cohort1 = next((c for c in cohorts if c["name"] == "Cohort 1"), None)
        assert cohort1 is not None
        assert cohort1["status"] == "active"
        
        print(f"Cohorts: {len(cohorts)} total")
        for c in cohorts:
            print(f"  - {c['name']}: {c['status']}")
    
    def test_worker_diagnostic(self):
        """Test individual worker diagnostic"""
        # First get a worker ID from builder core
        response = requests.get(f"{BASE_URL}/api/enterprise/{self.enterprise_id}/builder-core", headers=self.headers)
        data = response.json()
        worker_id = data["candidates"][0]["id"]
        
        # Get worker diagnostic
        response = requests.get(f"{BASE_URL}/api/enterprise/{self.enterprise_id}/workers/{worker_id}", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        worker = data["worker"]
        assert worker["id"] == worker_id
        assert "name" in worker
        assert "displacement_direction_score" in worker
        assert "displacement_category" in worker
        assert "tasks" in worker
        assert len(worker["tasks"]) > 0
        
        print(f"Worker diagnostic: {worker['name']}, score={worker['displacement_direction_score']}, category={worker['displacement_category']}")
    
    def test_board_report_pdf(self):
        """Test board report PDF generation"""
        response = requests.get(f"{BASE_URL}/api/enterprise/{self.enterprise_id}/report", headers=self.headers)
        assert response.status_code == 200
        assert response.headers.get("content-type") == "application/pdf"
        
        # Check PDF has content
        assert len(response.content) > 1000
        
        print(f"Board report PDF generated: {len(response.content)} bytes")


class TestParticipantDashboard:
    """Participant (learner) dashboard and task tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        login_res = requests.post(f"{BASE_URL}/api/auth/login", json=PARTICIPANT)
        data = login_res.json()
        self.token = data["token"]
        self.user = data["user"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_participant_dashboard(self):
        """Test participant dashboard loads with diagnostic summary"""
        response = requests.get(f"{BASE_URL}/api/learn/dashboard", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        # Check worker diagnostic
        assert data["worker"] is not None
        assert data["worker"]["displacement_direction_score"] is not None
        
        # Check domains (should be 4)
        domains = data["domains"]
        assert len(domains) == 4, f"Expected 4 domains, got {len(domains)}"
        
        print(f"Participant dashboard: {len(domains)} domains")
        for d in domains:
            print(f"  - {d['title']}: {d['tasks_completed']}/{d['tasks_total']} completed")
    
    def test_participant_diagnostic(self):
        """Test participant can view their diagnostic"""
        response = requests.get(f"{BASE_URL}/api/learn/diagnostic", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        diag = data["diagnostic"]
        assert "displacement_direction_score" in diag
        assert "displacement_interpretation" in diag
        # Should NOT include sensitive manager data
        assert "manager_top_quote" not in diag or diag.get("manager_top_quote") is None
        
        print(f"Participant diagnostic: score={diag['displacement_direction_score']}, category={diag['displacement_category']}")
    
    def test_participant_domains(self):
        """Test participant domains list"""
        response = requests.get(f"{BASE_URL}/api/learn/domains", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        domains = data["domains"]
        assert len(domains) == 4
        
        # Check domain structure
        for d in domains:
            assert "id" in d
            assert "title" in d
            assert "tasks" in d
        
        print(f"Domains with tasks loaded: {len(domains)} domains")
    
    def test_domain_tasks(self):
        """Test getting tasks for a domain"""
        # Get domains first
        domains_res = requests.get(f"{BASE_URL}/api/learn/domains", headers=self.headers)
        domain_id = domains_res.json()["domains"][0]["id"]
        
        # Get tasks for domain
        response = requests.get(f"{BASE_URL}/api/learn/domains/{domain_id}/tasks", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert "domain" in data
        assert "tasks" in data
        assert len(data["tasks"]) > 0
        
        print(f"Domain tasks: {len(data['tasks'])} tasks in {data['domain']['title']}")
    
    def test_task_detail(self):
        """Test getting full task detail"""
        # Get domains first
        domains_res = requests.get(f"{BASE_URL}/api/learn/domains", headers=self.headers)
        domain_id = domains_res.json()["domains"][0]["id"]
        
        # Get tasks
        tasks_res = requests.get(f"{BASE_URL}/api/learn/domains/{domain_id}/tasks", headers=self.headers)
        task_id = tasks_res.json()["tasks"][0]["id"]
        
        # Get task detail
        response = requests.get(f"{BASE_URL}/api/learn/domains/{domain_id}/tasks/{task_id}", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        task = data["task"]
        assert "context_banner" in task
        assert "practical_scenario" in task
        assert "build_exercise" in task
        assert "resources" in task
        
        print(f"Task detail: {task['title']}")
        print(f"  - Has video: {'video_url' in task and task['video_url']}")
        print(f"  - Resources: {len(task.get('resources', []))}")
    
    def test_my_mentor(self):
        """Test participant can view their mentor"""
        response = requests.get(f"{BASE_URL}/api/learn/mentor", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        # Anna should have Marcus as mentor
        if data["mentor"]:
            assert "name" in data["mentor"]
            assert "credential" in data["mentor"]
            print(f"My mentor: {data['mentor']['name']} - {data['mentor']['credential']}")
        else:
            print("No mentor assigned")


class TestCommunity:
    """Community hub and discussion tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        login_res = requests.post(f"{BASE_URL}/api/auth/login", json=PARTICIPANT)
        data = login_res.json()
        self.token = data["token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_community_hub_mentors(self):
        """Test community hub returns mentors"""
        response = requests.get(f"{BASE_URL}/api/community/hub", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        mentors = data["mentors"]
        assert len(mentors) >= 3, f"Expected at least 3 mentors, got {len(mentors)}"
        
        # Check mentor structure
        for m in mentors:
            assert "name" in m
            assert "credential" in m
            assert "bio" in m
        
        print(f"Community hub: {len(mentors)} mentors")
        for m in mentors:
            print(f"  - {m['name']}: {m['credential']}")
    
    def test_community_feed(self):
        """Test community activity feed"""
        response = requests.get(f"{BASE_URL}/api/community/feed", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        # Feed should exist (may be empty)
        assert "feed" in data
        print(f"Activity feed: {len(data['feed'])} items")


class TestNotifications:
    """Notification tests for different roles"""
    
    def test_enterprise_admin_notifications(self):
        """Test enterprise admin can get notifications"""
        login_res = requests.post(f"{BASE_URL}/api/auth/login", json=ENTERPRISE_ADMIN)
        token = login_res.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{BASE_URL}/api/notifications", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "notifications" in data
        print(f"Enterprise admin notifications: {len(data['notifications'])} items")
    
    def test_participant_notifications(self):
        """Test participant can get notifications"""
        login_res = requests.post(f"{BASE_URL}/api/auth/login", json=PARTICIPANT)
        token = login_res.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{BASE_URL}/api/notifications", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "notifications" in data
        print(f"Participant notifications: {len(data['notifications'])} items")


class TestSubmissions:
    """Submission workflow tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        login_res = requests.post(f"{BASE_URL}/api/auth/login", json=PARTICIPANT)
        data = login_res.json()
        self.token = data["token"]
        self.user = data["user"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
        
        # Get a task for submission
        domains_res = requests.get(f"{BASE_URL}/api/learn/domains", headers=self.headers)
        self.domain_id = domains_res.json()["domains"][0]["id"]
        tasks_res = requests.get(f"{BASE_URL}/api/learn/domains/{self.domain_id}/tasks", headers=self.headers)
        self.task_id = tasks_res.json()["tasks"][0]["id"]
    
    def test_create_submission(self):
        """Test creating a submission"""
        response = requests.post(f"{BASE_URL}/api/submissions", headers=self.headers, json={
            "task_id": self.task_id,
            "domain_id": self.domain_id,
            "title": "TEST_Submission",
            "description": "Test submission from pytest",
            "project_url": "https://github.com/test/test"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Submission created"
        assert "id" in data
        
        print(f"Submission created: {data['id']}")
    
    def test_get_submissions(self):
        """Test getting user submissions"""
        response = requests.get(f"{BASE_URL}/api/submissions", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        # Should be a list
        assert isinstance(data, list)
        print(f"User submissions: {len(data)} items")


class TestAdminAnalytics:
    """Admin analytics tests"""
    
    def test_admin_analytics(self):
        """Test admin analytics endpoint"""
        login_res = requests.post(f"{BASE_URL}/api/auth/login", json=SUPER_ADMIN)
        token = login_res.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{BASE_URL}/api/admin/analytics", headers=headers)
        assert response.status_code == 200
        data = response.json()
        
        assert data["total_workers"] == 587
        assert "displacement" in data
        
        print(f"Admin analytics: {data['total_workers']} workers, {data['enterprises']} enterprises")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
