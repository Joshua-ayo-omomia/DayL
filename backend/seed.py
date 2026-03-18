import uuid
import random
from datetime import datetime, timezone, timedelta

random.seed(42)

# ============== NAME DATA ==============

JAMAICA_FIRST = ["Charis", "Otis", "Patrick", "Akeem", "Shanice", "Demar", "Kadian", "Marlon",
    "Tamara", "Dwayne", "Simone", "Andre", "Nadine", "Garfield", "Shelly", "Omar",
    "Keisha", "Ricardo", "Alicia", "Jermaine", "Camille", "Winston", "Latoya", "Donovan",
    "Sasha", "Damion", "Monique", "Leroy", "Tanya", "Kirk", "Renee", "Floyd",
    "Tricia", "Delroy", "Stacy", "Kenrick", "Dionne", "Sheldon", "Cassandra", "Troy",
    "Beverley", "Carlton", "Sherry", "Desmond", "Natalie", "Errol", "Michelle", "Neville",
    "Audrey", "Cleveland", "Sophia", "Barrington", "Grace", "Norris", "Paulette", "Linton",
    "Crystal", "Derrick", "Joy", "Horace", "Marcia", "Lascelles", "Althea", "Orville"]

JAMAICA_LAST = ["Brown", "Williams", "Campbell", "Stewart", "Gordon", "Thompson", "Reid", "Morgan",
    "Smith", "Johnson", "Davis", "Robinson", "Wright", "Harris", "Clarke", "Miller",
    "Walker", "Martin", "Lewis", "Young", "Scott", "Green", "Hall", "Allen",
    "King", "Baker", "Hill", "Morris", "Bennett", "Henry", "Mitchell", "Watson",
    "Taylor", "Anderson", "Jackson", "White", "Thomas", "Edwards", "Collins", "Grant"]

CANADA_FIRST = ["Anna", "Johann", "Clarence", "Ivan", "Karen", "David", "Aftab", "Yunna",
    "Priya", "James", "Wei", "Sarah", "Mohammed", "Jennifer", "Rajesh", "Catherine",
    "Chen", "Michael", "Fatima", "Robert", "Anjali", "Christopher", "Li", "Emily",
    "Vikram", "Jessica", "Tariq", "Megan", "Deepak", "Rachel", "Omar", "Stephanie",
    "Navid", "Lauren", "Sanjay", "Heather", "Hassan", "Diane", "Ravi", "Nicole",
    "Eugene", "Kelly", "Carol", "Dennis", "Amara", "George", "Nadia", "Thomas"]

CANADA_LAST = ["Chen", "Patel", "Kim", "Nguyen", "Singh", "Lee", "Brown", "Wilson",
    "Taylor", "Anderson", "White", "Martin", "Thompson", "Garcia", "Rodriguez", "Chai",
    "McCulloch", "Siddiqi", "Tang", "McIntosh", "Donnet", "McDermott", "Park", "Li",
    "Wang", "Zhang", "Liu", "Sharma", "Kumar", "Das", "Blackwood", "Fraser"]

USA_FIRST = ["Jason", "Brittany", "Marcus", "Ashley", "Tyler", "Megan", "Derek", "Samantha",
    "Brandon", "Tiffany", "Justin", "Amanda", "Kyle", "Heather", "Ryan", "Nicole"]

USA_LAST = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson",
    "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin"]

TT_FIRST = ["Anil", "Ria", "Kwame", "Priya", "Darnell", "Kamla", "Jerome", "Anisa",
    "Tyrell", "Sunita", "Nigel", "Reshma", "Wendell", "Nalini", "Stefan", "Kavita"]

TT_LAST = ["Mohammed", "Singh", "Ramjattan", "Persad", "Charles", "Baptiste", "Joseph", "Ali",
    "Williams", "Thomas", "Seepersad", "Narine", "George", "Ramsaroop", "Phillips", "Khan"]

BB_FIRST = ["Kemar", "Rihanna", "Shawn", "Donna", "Adrian", "Lisa", "Wayne", "Sandra",
    "Trevor", "Angela", "Cedric", "Denise", "Ian", "Wendy", "Malcolm", "Janice"]

BB_LAST = ["Alleyne", "Brathwaite", "Clarke", "Downes", "Forde", "Greenidge", "Haynes", "Jordan",
    "King", "Lashley", "Marshall", "Nurse", "Payne", "Rowe", "Stuart", "Walcott"]

CW_FIRST = ["Rinaldo", "Cheyenne", "Jandino", "Xiomara", "Randall", "Sharlene", "Mervin", "Dainelys",
    "Jurickson", "Zuleyka", "Churandy", "Magaly", "Kenley", "Rosemarie", "Elson", "Giselle"]

CW_LAST = ["Martina", "Profar", "Alberto", "Rosario", "Jansen", "de Paula", "Zimmerman", "Maduro",
    "Croes", "Koolman", "van der Biezen", "Willems", "Henriquez", "Pietersz", "Emerencia", "Sevinger"]

# ============== DEPARTMENTS & ROLES ==============

DEPARTMENTS = {
    "Group Application Services": {
        "count": 120,
        "roles": ["Application Developer", "Sr Application Developer", "Systems Analyst", "Manager Application Services",
                   "Technical Lead Applications", "Business Systems Analyst", "Application Support Specialist"],
        "displacement_tendency": (4.0, 7.0)
    },
    "Infrastructure & Technical Services": {
        "count": 95,
        "roles": ["Infrastructure Engineer", "Sr Infrastructure Engineer", "Network Specialist", "Systems Administrator",
                   "Cloud Engineer", "Technical Support Lead", "Manager Infrastructure"],
        "displacement_tendency": (3.5, 6.5)
    },
    "Data & Analytics": {
        "count": 75,
        "roles": ["Data Analyst", "Sr Data Analyst", "Data Engineer", "Business Intelligence Developer",
                   "Analytics Manager", "Data Architect", "Machine Learning Specialist"],
        "displacement_tendency": (5.5, 8.5)
    },
    "IT Risk and Security": {
        "count": 55,
        "roles": ["Security Analyst", "Sr Security Analyst", "BCM Specialist", "IT Risk Manager",
                   "Cybersecurity Engineer", "Compliance Analyst", "Security Architect"],
        "displacement_tendency": (4.0, 7.0)
    },
    "Corporate Systems": {
        "count": 50,
        "roles": ["Sr Business Systems Specialist", "Business Systems JDE Specialist", "ERP Analyst",
                   "Corporate Systems Manager", "Integration Specialist", "Systems Support Analyst"],
        "displacement_tendency": (3.5, 6.5)
    },
    "Web Services": {
        "count": 45,
        "roles": ["Web Developer", "Sr Web Developer", "Technical Lead Web Services", "UX Designer",
                   "Frontend Developer", "Business Systems Analyst Web", "Web Services Manager"],
        "displacement_tendency": (5.5, 8.5)
    },
    "Innovation": {
        "count": 35,
        "roles": ["Innovation Analyst", "Digital Transformation Lead", "AI Specialist", "Innovation Manager",
                   "Emerging Technology Researcher", "Solutions Architect Innovation"],
        "displacement_tendency": (6.0, 9.0)
    },
    "Business Optimization": {
        "count": 55,
        "roles": ["Process Analyst", "Business Optimization Specialist", "Project Manager", "Change Manager",
                   "Operations Analyst", "Quality Assurance Lead", "Business Optimization Manager"],
        "displacement_tendency": (2.5, 5.5)
    },
    "Group Testing Support": {
        "count": 35,
        "roles": ["QA Tester", "Sr QA Tester", "Test Automation Engineer", "Test Manager",
                   "Performance Tester", "QA Analyst"],
        "displacement_tendency": (3.0, 6.0)
    },
    "Other/Support": {
        "count": 22,
        "roles": ["IT Coordinator", "Technical Writer", "Training Specialist", "Help Desk Analyst",
                   "Asset Manager", "Vendor Manager"],
        "displacement_tendency": (2.0, 5.0)
    }
}

TASK_TEMPLATES = {
    "Group Application Services": [
        ("Application development and coding", "automates_easy_part", "rising", "AI generates boilerplate code, developer focuses on business logic and architecture"),
        ("Legacy system maintenance", "automates_easy_part", "rising", "AI handles routine bug fixes and patches, developer manages complex system interactions"),
        ("Requirements analysis", "minimal", "stable", "Requires stakeholder communication and business context understanding"),
        ("Code review and quality assurance", "automates_easy_part", "rising", "AI identifies common patterns and issues, developer validates business logic"),
        ("System integration design", "minimal", "stable", "Requires understanding of organizational systems and business processes"),
        ("Technical documentation", "automates_easy_part", "rising", "AI drafts documentation from code, developer validates accuracy"),
    ],
    "Infrastructure & Technical Services": [
        ("Server provisioning and configuration", "automates_easy_part", "rising", "AI automates standard configurations, engineer handles complex edge cases"),
        ("Network monitoring and troubleshooting", "automates_easy_part", "rising", "AI detects patterns in network issues, engineer diagnoses root causes"),
        ("Cloud infrastructure management", "minimal", "stable", "Requires understanding of cost optimization and architecture decisions"),
        ("Incident response and resolution", "minimal", "stable", "Requires judgment and cross-team coordination"),
        ("Capacity planning", "automates_easy_part", "rising", "AI provides predictive analytics, engineer makes strategic decisions"),
        ("Security patching and updates", "automates_hard_part", "commoditizing", "Automated tools handle most patching workflows"),
    ],
    "Data & Analytics": [
        ("Data pipeline development", "automates_easy_part", "rising", "AI generates ETL code, engineer designs data architecture"),
        ("Business intelligence reporting", "automates_hard_part", "commoditizing", "AI can generate standard reports and dashboards automatically"),
        ("Data quality management", "automates_easy_part", "rising", "AI identifies data quality issues, engineer designs remediation strategies"),
        ("Statistical analysis and modeling", "minimal", "stable", "Requires domain expertise and interpretive judgment"),
        ("Data architecture design", "minimal", "stable", "Requires understanding of business needs and system constraints"),
        ("Dashboard creation", "automates_hard_part", "commoditizing", "AI tools increasingly generate dashboards from natural language"),
    ],
    "IT Risk and Security": [
        ("Security assessment and audit", "automates_easy_part", "rising", "AI scans for vulnerabilities, analyst evaluates business risk context"),
        ("Incident investigation", "minimal", "stable", "Requires forensic analysis and contextual judgment"),
        ("Policy development and compliance", "minimal", "stable", "Requires understanding of regulatory landscape and organizational context"),
        ("Risk analysis and reporting", "automates_easy_part", "rising", "AI generates risk scores, analyst provides strategic recommendations"),
        ("Business continuity planning", "minimal", "stable", "Requires organizational knowledge and scenario planning"),
        ("Security awareness training", "automates_easy_part", "rising", "AI personalizes training content, specialist designs program strategy"),
    ],
    "Corporate Systems": [
        ("ERP system administration", "automates_easy_part", "rising", "AI handles routine configurations, specialist manages complex customizations"),
        ("Business process mapping", "minimal", "stable", "Requires deep understanding of organizational workflows"),
        ("System integration management", "minimal", "stable", "Requires cross-functional coordination and architectural decisions"),
        ("Vendor management", "minimal", "stable", "Requires relationship management and negotiation skills"),
        ("User support and training", "automates_hard_part", "commoditizing", "AI chatbots handle routine queries, specialist handles complex issues"),
        ("Report generation and analysis", "automates_hard_part", "commoditizing", "AI generates standard reports automatically"),
    ],
    "Web Services": [
        ("Frontend development", "automates_easy_part", "rising", "AI generates UI components, developer focuses on UX and complex interactions"),
        ("API design and development", "automates_easy_part", "rising", "AI scaffolds APIs, developer designs architecture and business logic"),
        ("User experience design", "minimal", "stable", "Requires empathy, user research, and creative problem-solving"),
        ("Performance optimization", "automates_easy_part", "rising", "AI identifies bottlenecks, developer implements strategic optimizations"),
        ("Web application security", "automates_easy_part", "rising", "AI scans for vulnerabilities, developer implements secure architecture"),
        ("Content management", "automates_hard_part", "commoditizing", "AI tools increasingly manage and generate web content"),
    ],
    "Innovation": [
        ("Technology research and evaluation", "minimal", "stable", "Requires strategic thinking and cross-domain knowledge"),
        ("Proof of concept development", "automates_easy_part", "rising", "AI accelerates prototyping, specialist focuses on novel applications"),
        ("Digital transformation strategy", "minimal", "stable", "Requires organizational understanding and change management"),
        ("AI/ML solution design", "minimal", "stable", "Requires deep technical knowledge and business context"),
        ("Stakeholder engagement", "minimal", "stable", "Requires communication skills and relationship building"),
        ("Innovation program management", "minimal", "stable", "Requires strategic planning and cross-functional leadership"),
    ],
    "Business Optimization": [
        ("Process analysis and documentation", "automates_hard_part", "commoditizing", "AI can map and document processes from system logs"),
        ("Project management", "automates_easy_part", "rising", "AI handles scheduling and reporting, manager focuses on stakeholder alignment"),
        ("Change management", "minimal", "stable", "Requires organizational psychology and leadership skills"),
        ("Quality assurance oversight", "automates_hard_part", "commoditizing", "AI automates quality checks and compliance verification"),
        ("Performance metrics tracking", "automates_hard_part", "commoditizing", "AI dashboards replace manual metric collection"),
        ("Stakeholder reporting", "automates_hard_part", "commoditizing", "AI generates standardized reports from data"),
    ],
    "Group Testing Support": [
        ("Test case design", "automates_easy_part", "rising", "AI generates test cases, tester focuses on edge cases and business scenarios"),
        ("Test automation development", "automates_easy_part", "rising", "AI writes automation scripts, engineer designs test strategy"),
        ("Manual testing execution", "automates_hard_part", "commoditizing", "AI increasingly handles regression and standard test execution"),
        ("Performance testing", "automates_easy_part", "rising", "AI identifies performance patterns, engineer designs load scenarios"),
        ("Test environment management", "automates_hard_part", "commoditizing", "Infrastructure automation handles environment provisioning"),
        ("Defect analysis and reporting", "automates_easy_part", "rising", "AI categorizes defects, analyst identifies systemic issues"),
    ],
    "Other/Support": [
        ("Technical documentation", "automates_hard_part", "commoditizing", "AI generates documentation from code and system data"),
        ("User training delivery", "automates_hard_part", "commoditizing", "AI-powered training platforms replace manual delivery"),
        ("Help desk support", "automates_hard_part", "commoditizing", "AI chatbots handle majority of tier-1 support"),
        ("Asset tracking", "automates_hard_part", "commoditizing", "Automated inventory systems replace manual tracking"),
        ("Vendor coordination", "minimal", "stable", "Requires relationship management and negotiation"),
        ("Process documentation", "automates_hard_part", "commoditizing", "AI tools generate process docs from observations"),
    ],
}

# ============== BUILDER CORE (REAL DATA) ==============

BUILDER_CORE = [
    {
        "name": "Eugene McDermott", "email": "eugene.mcdermott@sagicor.com",
        "role_title": "BCM Specialist", "department": "IT Risk and Security", "country": "Canada",
        "manager_name": "Director, IT Risk", "sa_score": 3.62, "sa_status": "completed", "sa_qualitative_count": 38,
        "mv_score": 4.83, "mv_status": "completed", "mv_qualitative_count": 22,
        "self_awareness_gap": -1.21, "self_awareness_label": "Humble",
        "builder_classification": "Core Builder",
        "displacement_direction_score": 7.5, "displacement_category": "rising",
        "displacement_interpretation": "Your role is specializing. AI automates routine compliance checks while your risk assessment expertise and organizational knowledge become more valuable.",
        "tasks": [
            {"name": "Business continuity plan development", "ai_impact": "minimal", "direction": "stable", "description": "Requires deep organizational knowledge and scenario planning expertise"},
            {"name": "Risk assessment execution", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI identifies common risk patterns, specialist evaluates organizational context"},
            {"name": "Compliance monitoring", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI tracks regulatory changes, specialist interprets business impact"},
            {"name": "Incident response coordination", "ai_impact": "minimal", "direction": "stable", "description": "Requires cross-team leadership and real-time decision-making"},
            {"name": "Disaster recovery testing", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI simulates scenarios, specialist validates recovery procedures"},
        ],
        "pathway_type": "acceleration",
        "pathway_recommendation": "Lead AI-enhanced risk assessment initiatives. Integrate AI monitoring into business continuity frameworks to provide real-time risk intelligence.",
        "manager_top_quote": "Eugene consistently goes above and beyond. His ability to see risk from multiple perspectives and his proactive approach to mitigation make him invaluable to the team.",
        "manager_development_note": "Ready for senior leadership role. Would benefit from AI risk assessment certification and cross-functional project leadership.",
        "personalized_track_name": "AI-Enhanced Risk Intelligence"
    },
    {
        "name": "Anna (YueHua) Chen", "email": "anna.chen@sagicor.com",
        "role_title": "Technical Lead, Application Modernization", "department": "Web Services", "country": "Canada",
        "manager_name": "Nhan Le", "sa_score": 2.97, "sa_status": "completed", "sa_qualitative_count": 44,
        "mv_score": 4.17, "mv_status": "completed", "mv_qualitative_count": 18,
        "self_awareness_gap": -1.20, "self_awareness_label": "Humble",
        "builder_classification": "Core Builder",
        "displacement_direction_score": 7.8, "displacement_category": "rising",
        "displacement_interpretation": "Your role is specializing. AI automates routine aspects of application development while your architecture and modernization expertise becomes more valuable.",
        "tasks": [
            {"name": "Legacy code refactoring", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI handles routine code conversion, freeing expertise for architecture decisions"},
            {"name": "Architecture design", "ai_impact": "minimal", "direction": "stable", "description": "Requires human judgment, organizational context, and creative problem-solving"},
            {"name": "Team mentoring and code review", "ai_impact": "minimal", "direction": "stable", "description": "Human relationship, trust-building, and nuanced technical guidance"},
            {"name": "Test writing and QA", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI generates test scaffolding, human reviews logic and edge cases"},
            {"name": "Technical documentation", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI drafts documentation from code, human validates accuracy and context"},
        ],
        "pathway_type": "acceleration",
        "pathway_recommendation": "Lead AI-driven modernization initiatives. Transition from hands-on coding to AI-augmented architecture and team leadership.",
        "manager_top_quote": "Demonstrates quick learning and rapidly applies new knowledge. Proactively turns learning into innovative ideas and first-time solutions.",
        "manager_development_note": "Attend Leadership Impact program and opportunity in leading the new AI-driven development.",
        "personalized_track_name": "AI-Powered Application Modernization"
    },
    {
        "name": "Karen McCulloch", "email": "karen.mcculloch@sagicor.com",
        "role_title": "Sr Business Systems Specialist", "department": "Corporate Systems", "country": "Canada",
        "manager_name": "Director, Corporate Systems", "sa_score": 2.74, "sa_status": "completed", "sa_qualitative_count": 32,
        "mv_score": 4.43, "mv_status": "completed", "mv_qualitative_count": 20,
        "self_awareness_gap": -1.69, "self_awareness_label": "Humble",
        "builder_classification": "Core Builder",
        "displacement_direction_score": 5.8, "displacement_category": "stable",
        "displacement_interpretation": "Your role is in a monitoring zone. AI may automate some administrative tasks, but your deep systems knowledge and cross-functional expertise remain critical.",
        "tasks": [
            {"name": "Business systems configuration", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI handles routine configurations, specialist manages complex customizations"},
            {"name": "Cross-system integration", "ai_impact": "minimal", "direction": "stable", "description": "Requires understanding of multiple systems and business workflows"},
            {"name": "User requirements gathering", "ai_impact": "minimal", "direction": "stable", "description": "Requires communication skills and business domain expertise"},
            {"name": "System testing and validation", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI automates regression tests, specialist validates business logic"},
            {"name": "Vendor liaison and management", "ai_impact": "minimal", "direction": "stable", "description": "Requires relationship management and negotiation skills"},
        ],
        "pathway_type": "upskilling",
        "pathway_recommendation": "Build AI integration skills to enhance existing systems expertise. Focus on AI-assisted business process automation.",
        "manager_top_quote": "Karen is the go-to person for complex system issues. Her knowledge spans multiple platforms and her patience in training others is exceptional.",
        "manager_development_note": "Expand AI and automation skills. Potential to lead AI integration for corporate systems.",
        "personalized_track_name": "AI-Integrated Business Systems"
    },
    {
        "name": "Carol Blackwood", "email": "carol.blackwood@sagicor.com",
        "role_title": "Sr Business Systems Specialist", "department": "Data & Analytics", "country": "Canada",
        "manager_name": "Director, Data Analytics", "sa_score": 3.16, "sa_status": "completed", "sa_qualitative_count": 28,
        "mv_score": 4.33, "mv_status": "completed", "mv_qualitative_count": 16,
        "self_awareness_gap": -1.17, "self_awareness_label": "Humble",
        "builder_classification": "Emerging Builder",
        "displacement_direction_score": 6.5, "displacement_category": "stable",
        "displacement_interpretation": "Your role is in transition. Your data expertise positions you well, but proactive AI skill development will determine whether your role rises or remains static.",
        "tasks": [
            {"name": "Data analysis and reporting", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI generates routine reports, analyst focuses on strategic insights"},
            {"name": "Data quality management", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI identifies data anomalies, specialist designs quality frameworks"},
            {"name": "Stakeholder data presentation", "ai_impact": "minimal", "direction": "stable", "description": "Requires understanding of audience needs and narrative skills"},
            {"name": "Database query optimization", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI suggests optimizations, specialist validates business impact"},
            {"name": "Report automation", "ai_impact": "automates_hard_part", "direction": "commoditizing", "description": "AI tools increasingly handle end-to-end report generation"},
        ],
        "pathway_type": "upskilling",
        "pathway_recommendation": "Transition from traditional analytics to AI-augmented data strategy. Build skills in AI model evaluation and data governance for AI systems.",
        "manager_top_quote": "Carol brings a unique combination of business understanding and technical skill. She consistently delivers insights that drive decision-making.",
        "manager_development_note": "Focus on advanced analytics and AI/ML fundamentals. Strong candidate for data strategy leadership role.",
        "personalized_track_name": "AI Data Strategy"
    },
    {
        "name": "Clarence Chai", "email": "clarence.chai@sagicor.com",
        "role_title": "Sr Systems Specialist", "department": "Data & Analytics", "country": "Canada",
        "manager_name": "Director, Data Analytics", "sa_score": 3.39, "sa_status": "completed", "sa_qualitative_count": 36,
        "mv_score": 4.00, "mv_status": "completed", "mv_qualitative_count": 14,
        "self_awareness_gap": -0.61, "self_awareness_label": "Humble",
        "builder_classification": "Core Builder",
        "displacement_direction_score": 7.2, "displacement_category": "rising",
        "displacement_interpretation": "Your role is specializing. AI enhances your data engineering capabilities, making your system design expertise more valuable as data demands grow.",
        "tasks": [
            {"name": "Data pipeline architecture", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI generates pipeline code, engineer designs data architecture"},
            {"name": "System performance optimization", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI identifies bottlenecks, specialist implements strategic solutions"},
            {"name": "Data infrastructure design", "ai_impact": "minimal", "direction": "stable", "description": "Requires understanding of organizational data needs and growth patterns"},
            {"name": "Cross-team data integration", "ai_impact": "minimal", "direction": "stable", "description": "Requires coordination across teams and understanding of diverse data sources"},
            {"name": "Technical mentorship", "ai_impact": "minimal", "direction": "stable", "description": "Human guidance and knowledge transfer cannot be automated"},
        ],
        "pathway_type": "acceleration",
        "pathway_recommendation": "Lead AI data infrastructure initiatives. Design systems that serve both traditional analytics and AI/ML workloads.",
        "manager_top_quote": "Clarence has deep technical expertise and an ability to see the big picture. He mentors junior team members exceptionally well.",
        "manager_development_note": "Ready for technical leadership role in data infrastructure. AI/ML infrastructure skills would amplify his existing strengths.",
        "personalized_track_name": "AI Data Infrastructure"
    },
    {
        "name": "Aftab Siddiqi", "email": "aftab.siddiqi@sagicor.com",
        "role_title": "Sr Business Systems JDE Specialist", "department": "Corporate Systems", "country": "Canada",
        "manager_name": "Director, Corporate Systems", "sa_score": 3.42, "sa_status": "completed", "sa_qualitative_count": 30,
        "mv_score": 3.83, "mv_status": "completed", "mv_qualitative_count": 12,
        "self_awareness_gap": -0.41, "self_awareness_label": "Aligned",
        "builder_classification": "Core Builder",
        "displacement_direction_score": 5.5, "displacement_category": "stable",
        "displacement_interpretation": "Your role is stable but requires proactive evolution. Your deep JDE expertise is valuable but must be augmented with AI skills to remain strategic.",
        "tasks": [
            {"name": "JDE system administration", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI handles routine configurations, specialist manages complex enterprise logic"},
            {"name": "Business process automation", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI extends automation capabilities, specialist designs process strategy"},
            {"name": "System troubleshooting", "ai_impact": "minimal", "direction": "stable", "description": "Requires deep system knowledge and diagnostic reasoning"},
            {"name": "User training and support", "ai_impact": "automates_hard_part", "direction": "commoditizing", "description": "AI chatbots handle routine queries, specialist handles complex issues"},
            {"name": "ERP upgrade management", "ai_impact": "minimal", "direction": "stable", "description": "Requires project management and risk assessment skills"},
        ],
        "pathway_type": "upskilling",
        "pathway_recommendation": "Integrate AI capabilities into JDE ecosystem. Focus on AI-powered process automation and predictive system management.",
        "manager_top_quote": "Aftab is reliable, thorough, and deeply knowledgeable about our ERP systems. His work ethic sets the standard for the team.",
        "manager_development_note": "Build AI automation skills to enhance ERP management. Could lead AI integration for corporate systems platform.",
        "personalized_track_name": "AI-Powered Enterprise Systems"
    },
    {
        "name": "Ivan (Ho Wai) Tang", "email": "ivan.tang@sagicor.com",
        "role_title": "Business Systems Analyst", "department": "Web Services", "country": "Canada",
        "manager_name": "Manager, Web Services", "sa_score": 3.12, "sa_status": "completed", "sa_qualitative_count": 34,
        "mv_score": 3.83, "mv_status": "completed", "mv_qualitative_count": 15,
        "self_awareness_gap": -0.71, "self_awareness_label": "Humble",
        "builder_classification": "Core Builder (behavioral)",
        "displacement_direction_score": 7.0, "displacement_category": "rising",
        "displacement_interpretation": "Your role is specializing. AI enhances web development capabilities while your analytical skills and business understanding become more valuable.",
        "tasks": [
            {"name": "Web application analysis", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI assists with code analysis, analyst focuses on business requirements"},
            {"name": "Requirements documentation", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI drafts documentation, analyst validates business accuracy"},
            {"name": "User experience evaluation", "ai_impact": "minimal", "direction": "stable", "description": "Requires empathy and understanding of user behavior"},
            {"name": "System integration testing", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI generates test cases, analyst validates integration points"},
            {"name": "Stakeholder communication", "ai_impact": "minimal", "direction": "stable", "description": "Requires interpersonal skills and business context understanding"},
        ],
        "pathway_type": "acceleration",
        "pathway_recommendation": "Leverage AI tools to enhance web service delivery. Focus on AI-augmented user experience design and automated testing strategies.",
        "manager_top_quote": "Ivan is curious, collaborative, and always looking for ways to improve. He brings creative solutions to complex problems.",
        "manager_development_note": "Develop AI integration skills for web services. Strong candidate for technical lead role with mentorship support.",
        "personalized_track_name": "AI-Augmented Web Services"
    },
    {
        "name": "Charis Pringle", "email": "charis.pringle@sagicor.com",
        "role_title": "Manager, Technical Systems Analyst", "department": "Group Application Services", "country": "Jamaica",
        "manager_name": "VP, Application Services", "sa_score": 4.44, "sa_status": "completed", "sa_qualitative_count": 42,
        "mv_score": None, "mv_status": "pending", "mv_qualitative_count": 0,
        "self_awareness_gap": None, "self_awareness_label": "Pending",
        "builder_classification": "Core Builder (role-based)",
        "displacement_direction_score": 6.8, "displacement_category": "stable",
        "displacement_interpretation": "Your management role provides stability. AI augments your team capabilities while your leadership and organizational skills remain essential.",
        "tasks": [
            {"name": "Team leadership and management", "ai_impact": "minimal", "direction": "stable", "description": "Requires human leadership, motivation, and organizational skills"},
            {"name": "Technical systems analysis", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI assists with analysis, manager validates strategic alignment"},
            {"name": "Project planning and delivery", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI optimizes scheduling, manager handles stakeholder alignment"},
            {"name": "Resource allocation", "ai_impact": "minimal", "direction": "stable", "description": "Requires understanding of team capabilities and business priorities"},
            {"name": "Cross-departmental coordination", "ai_impact": "minimal", "direction": "stable", "description": "Requires relationship building and organizational navigation"},
        ],
        "pathway_type": "acceleration",
        "pathway_recommendation": "Lead AI adoption across application services. Position team for AI-augmented development practices.",
        "manager_top_quote": "Pending manager validation.",
        "manager_development_note": "Pending manager validation.",
        "personalized_track_name": "AI Leadership for Application Services"
    },
    {
        "name": "Kelly Donnet", "email": "kelly.donnet@sagicor.com",
        "role_title": "Sr Telecommunications Specialist", "department": "Infrastructure & Technical Services", "country": "Canada",
        "manager_name": "Director, Infrastructure", "sa_score": 3.04, "sa_status": "completed", "sa_qualitative_count": 26,
        "mv_score": 4.00, "mv_status": "completed", "mv_qualitative_count": 14,
        "self_awareness_gap": -0.96, "self_awareness_label": "Humble",
        "builder_classification": "Core Builder",
        "displacement_direction_score": 5.2, "displacement_category": "stable",
        "displacement_interpretation": "Your telecommunications expertise is stable. AI automates monitoring but your network design and troubleshooting skills remain essential.",
        "tasks": [
            {"name": "Network design and planning", "ai_impact": "minimal", "direction": "stable", "description": "Requires understanding of organizational needs and growth projections"},
            {"name": "Telecommunications system management", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI monitors systems, specialist handles complex configurations"},
            {"name": "Vendor negotiations", "ai_impact": "minimal", "direction": "stable", "description": "Requires relationship management and technical knowledge"},
            {"name": "Network security implementation", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI detects threats, specialist implements security architecture"},
            {"name": "Capacity planning", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI provides usage analytics, specialist makes infrastructure decisions"},
        ],
        "pathway_type": "upskilling",
        "pathway_recommendation": "Build AI-powered network management skills. Focus on AI-driven network optimization and predictive maintenance.",
        "manager_top_quote": "Kelly is dependable and thorough. Her telecommunications expertise is critical to our multi-country operations.",
        "manager_development_note": "Develop AI/ML skills for network optimization. Could lead AI-enhanced infrastructure monitoring initiative.",
        "personalized_track_name": "AI-Powered Network Infrastructure"
    },
    {
        "name": "Otis Kidd", "email": "otis.kidd@sagicor.com",
        "role_title": "Manager, Systems Support", "department": "Infrastructure & Technical Services", "country": "Jamaica",
        "manager_name": "VP, Infrastructure", "sa_score": 3.36, "sa_status": "completed", "sa_qualitative_count": 30,
        "mv_score": 2.91, "mv_status": "completed", "mv_qualitative_count": 10,
        "self_awareness_gap": 0.45, "self_awareness_label": "Over-estimates",
        "builder_classification": "Core Builder",
        "displacement_direction_score": 5.0, "displacement_category": "stable",
        "displacement_interpretation": "Your management role is stable but your support team faces automation pressure. Leading AI transformation of support operations is your growth path.",
        "tasks": [
            {"name": "Support team management", "ai_impact": "minimal", "direction": "stable", "description": "Requires leadership, motivation, and performance management skills"},
            {"name": "Escalation handling", "ai_impact": "minimal", "direction": "stable", "description": "Requires technical depth and judgment under pressure"},
            {"name": "Process improvement", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI identifies improvement opportunities, manager drives organizational change"},
            {"name": "Knowledge base management", "ai_impact": "automates_hard_part", "direction": "commoditizing", "description": "AI can generate and maintain knowledge bases from ticket data"},
            {"name": "Service level management", "ai_impact": "automates_easy_part", "direction": "rising", "description": "AI tracks metrics automatically, manager focuses on strategic improvements"},
        ],
        "pathway_type": "upskilling",
        "pathway_recommendation": "Transform support operations with AI. Lead the transition from reactive support to AI-augmented proactive service management.",
        "manager_top_quote": "Otis knows the infrastructure inside and out. He keeps systems running across multiple countries and his team respects his leadership.",
        "manager_development_note": "Build AI operations skills. Lead AI-powered support transformation across Jamaica operations.",
        "personalized_track_name": "AI-Powered IT Operations Leadership"
    },
]


SKILL_DIMENSION_NAMES = ["AI Literacy", "Data Analysis", "Tool Proficiency", "Strategic Thinking", "Automation Design", "Communication"]

def generate_skill_dimensions(sa_score, displacement_category, in_training=False, progress_pct=0):
    """Generate skill dimensions for a worker based on assessment scores."""
    base_factor = (sa_score or 3.0) / 5.0
    dims = {}
    for i, name in enumerate(SKILL_DIMENSION_NAMES):
        key = name.lower().replace(" ", "_")
        noise = random.uniform(-0.4, 0.4)
        baseline = round(max(1.0, min(5.0, (base_factor * 3.5) + noise + (0.5 if displacement_category == "rising" else -0.3 if displacement_category == "at_risk" else 0))), 2)
        if in_training and progress_pct > 0:
            growth = round(random.uniform(0.3, 1.5) * (progress_pct / 100), 2)
            current = round(min(5.0, baseline + growth), 2)
        else:
            current = baseline
        dims[key] = {"baseline": baseline, "current": current}
    return dims


def generate_worker_name(country, used_names):
    """Generate a unique worker name for a given country."""
    name_maps = {
        "Jamaica": (JAMAICA_FIRST, JAMAICA_LAST),
        "Canada": (CANADA_FIRST, CANADA_LAST),
        "USA": (USA_FIRST, USA_LAST),
        "Trinidad and Tobago": (TT_FIRST, TT_LAST),
        "Barbados": (BB_FIRST, BB_LAST),
        "Curacao": (CW_FIRST, CW_LAST),
    }
    firsts, lasts = name_maps.get(country, (USA_FIRST, USA_LAST))
    for _ in range(100):
        name = f"{random.choice(firsts)} {random.choice(lasts)}"
        if name not in used_names:
            used_names.add(name)
            return name
    return f"Worker-{uuid.uuid4().hex[:6]}"


async def run_seed(db, hash_password):
    enterprise_id = str(uuid.uuid4())
    cohort_id = str(uuid.uuid4())

    # ===== Enterprise =====
    enterprise = {
        "id": enterprise_id,
        "name": "Sagicor Financial Company",
        "logo_url": None,
        "countries": ["Jamaica", "Canada", "USA", "Barbados", "Trinidad and Tobago", "Curacao"],
        "total_workers": 587,
        "assessment_status": "in_progress",
        "contract_value": 200000,
        "start_date": "2025-12-01",
        "primary_contact": "Neil",
        "admin_user_ids": []
    }
    await db.enterprises.insert_one(enterprise)

    # ===== Generate 587 Workers =====
    country_dist = {"Jamaica": 280, "Canada": 180, "USA": 50, "Trinidad and Tobago": 35, "Barbados": 25, "Curacao": 17}
    displacement_targets = {"rising": 187, "stable": 243, "at_risk": 157}

    # Assign displacement categories
    categories = (["rising"] * 187) + (["stable"] * 243) + (["at_risk"] * 157)
    random.shuffle(categories)

    dept_list = []
    for dept, info in DEPARTMENTS.items():
        dept_list.extend([dept] * info["count"])
    random.shuffle(dept_list)

    country_list = []
    for country, count in country_dist.items():
        country_list.extend([country] * count)
    random.shuffle(country_list)

    builder_core_names = {bc["name"] for bc in BUILDER_CORE}
    builder_core_by_name = {bc["name"]: bc for bc in BUILDER_CORE}
    used_names = set(builder_core_names)

    all_workers = []

    # Insert real builder core first
    for bc in BUILDER_CORE:
        worker = {
            "id": str(uuid.uuid4()),
            "enterprise_id": enterprise_id,
            "name": bc["name"],
            "email": bc["email"],
            "role_title": bc["role_title"],
            "department": bc["department"],
            "country": bc["country"],
            "manager_name": bc["manager_name"],
            "sa_score": bc["sa_score"],
            "sa_status": bc["sa_status"],
            "sa_qualitative_count": bc["sa_qualitative_count"],
            "mv_score": bc["mv_score"],
            "mv_status": bc["mv_status"],
            "mv_qualitative_count": bc["mv_qualitative_count"],
            "self_awareness_gap": bc["self_awareness_gap"],
            "self_awareness_label": bc["self_awareness_label"],
            "builder_classification": bc["builder_classification"],
            "displacement_direction_score": bc["displacement_direction_score"],
            "displacement_category": bc["displacement_category"],
            "displacement_interpretation": bc["displacement_interpretation"],
            "tasks": bc["tasks"],
            "pathway_type": bc["pathway_type"],
            "pathway_recommendation": bc["pathway_recommendation"],
            "manager_top_quote": bc["manager_top_quote"],
            "manager_development_note": bc["manager_development_note"],
            "cohort_id": cohort_id,
            "skill_dimensions": generate_skill_dimensions(bc["sa_score"], bc["displacement_category"], in_training=True, progress_pct=random.randint(25, 65)),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        all_workers.append(worker)

    # Generate remaining synthetic workers (587 - 10 = 577)
    synthetic_count = 587 - len(BUILDER_CORE)
    cat_idx = 0
    for i in range(synthetic_count):
        country = country_list[i % len(country_list)]
        dept = dept_list[i % len(dept_list)]
        dept_info = DEPARTMENTS[dept]
        cat = categories[cat_idx % len(categories)]
        cat_idx += 1

        name = generate_worker_name(country, used_names)
        role = random.choice(dept_info["roles"])

        sa_score = round(random.gauss(3.2, 0.5), 2)
        sa_score = max(1.3, min(4.7, sa_score))

        has_mv = random.random() < 0.4
        mv_score = round(random.gauss(3.1, 0.7), 2) if has_mv else None
        if mv_score is not None:
            mv_score = max(1.0, min(5.0, mv_score))

        if cat == "rising":
            dd_score = round(random.uniform(7.0, 9.5), 1)
        elif cat == "stable":
            dd_score = round(random.uniform(4.0, 6.9), 1)
        else:
            dd_score = round(random.uniform(1.5, 3.9), 1)

        gap = round(sa_score - mv_score, 2) if mv_score else None
        if gap is not None:
            if gap < -0.3:
                gap_label = "Humble"
            elif gap <= 0.3:
                gap_label = "Aligned"
            else:
                gap_label = "Over-estimates"
        else:
            gap_label = "Pending"

        interp_map = {
            "rising": f"This role is specializing. AI automates routine aspects while {name.split()[0]}'s expertise becomes more valuable.",
            "stable": f"This role requires monitoring. Displacement direction is unclear and proactive skill development is recommended.",
            "at_risk": f"This role is commoditizing. AI is automating core tasks and reallocation planning is needed.",
        }

        dept_tasks = TASK_TEMPLATES.get(dept, TASK_TEMPLATES["Other/Support"])
        selected_tasks = random.sample(dept_tasks, min(random.randint(5, 6), len(dept_tasks)))
        tasks = [{"name": t[0], "ai_impact": t[1], "direction": t[2], "description": t[3]} for t in selected_tasks]

        pathway_map = {"rising": "acceleration", "stable": "upskilling", "at_risk": "reallocation"}

        manager_names_pool = ["Sarah Mitchell", "David Chen", "Keisha Brown", "Rajesh Patel", "Nhan Le",
                              "Patricia Morgan", "James Williams", "Amira Hassan", "Chris Taylor", "Wendy Scott"]

        worker = {
            "id": str(uuid.uuid4()),
            "enterprise_id": enterprise_id,
            "name": name,
            "email": f"{name.lower().replace(' ', '.').replace('(', '').replace(')', '')}@sagicor.com",
            "role_title": role,
            "department": dept,
            "country": country,
            "manager_name": random.choice(manager_names_pool),
            "sa_score": sa_score,
            "sa_status": "completed",
            "sa_qualitative_count": random.randint(15, 45),
            "mv_score": mv_score,
            "mv_status": "completed" if has_mv else "pending",
            "mv_qualitative_count": random.randint(8, 22) if has_mv else 0,
            "self_awareness_gap": gap,
            "self_awareness_label": gap_label,
            "builder_classification": None,
            "displacement_direction_score": dd_score,
            "displacement_category": cat,
            "displacement_interpretation": interp_map[cat],
            "tasks": tasks,
            "pathway_type": pathway_map[cat],
            "pathway_recommendation": f"{'Lead AI initiatives in ' + dept if cat == 'rising' else 'Build AI skills for ' + dept if cat == 'stable' else 'Transition to AI-augmented role in ' + dept}.",
            "manager_top_quote": None,
            "manager_development_note": None,
            "cohort_id": None,
            "skill_dimensions": generate_skill_dimensions(sa_score, cat),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        all_workers.append(worker)

    if all_workers:
        await db.workers.insert_many(all_workers)

    # ===== Mentors =====
    mentor1_id = str(uuid.uuid4())
    mentor2_id = str(uuid.uuid4())
    mentor3_id = str(uuid.uuid4())
    mentor1_user_id = str(uuid.uuid4())
    mentor2_user_id = str(uuid.uuid4())
    mentor3_user_id = str(uuid.uuid4())

    mentors = [
        {
            "id": mentor1_id, "user_id": mentor1_user_id,
            "name": "Marcus Thompson", "credential": "Former Meta Engineering Lead",
            "specialization": "AI workflow automation and agent architecture", "years_experience": 8,
            "bio": "8 years building AI-powered systems at Meta. Led the development of internal AI workflow tools used by 3,000+ engineers. Specializes in helping enterprise teams transition from traditional development to AI-augmented workflows.",
            "mentoring_approach": "I focus on helping you ship production-quality AI solutions, not just prototypes.",
            "photo_url": None, "assigned_cohort_ids": [cohort_id], "is_active": True
        },
        {
            "id": mentor2_id, "user_id": mentor2_user_id,
            "name": "David Okafor", "credential": "Former NVIDIA AI Specialist",
            "specialization": "Enterprise AI deployment and GPU-accelerated computing", "years_experience": 6,
            "bio": "6 years at NVIDIA working on enterprise AI deployment. Helped Fortune 500 companies deploy AI inference at scale. Deep experience in production AI monitoring, cost optimization, and infrastructure design.",
            "mentoring_approach": "If it doesn't work in production, it doesn't work. I push you to build things that survive real traffic.",
            "photo_url": None, "assigned_cohort_ids": [cohort_id], "is_active": True
        },
        {
            "id": mentor3_id, "user_id": mentor3_user_id,
            "name": "Sarah Kim", "credential": "Former OpenAI Practitioner",
            "specialization": "LLM applications and prompt engineering", "years_experience": 5,
            "bio": "5 years building LLM applications, including 2 years at OpenAI. Expert in production prompt engineering, AI agent design, and building reliable AI systems. Passionate about helping experienced professionals integrate AI into their existing expertise.",
            "mentoring_approach": "The best AI solutions come from domain experts who learn to speak AI, not AI experts who learn your domain.",
            "photo_url": None, "assigned_cohort_ids": [], "is_active": True
        },
    ]
    await db.mentors.insert_many(mentors)

    # ===== User Accounts =====
    anna_worker = next(w for w in all_workers if w["name"] == "Anna (YueHua) Chen")
    dennis_worker_data = next((w for w in all_workers if w["name"] == "Clarence Chai"), all_workers[4])

    anna_user_id = str(uuid.uuid4())
    dennis_user_id = str(uuid.uuid4())
    neil_user_id = str(uuid.uuid4())
    ayo_user_id = str(uuid.uuid4())

    # Find Dennis McIntosh or create a reference
    dennis_track_name = "AI Data Infrastructure"

    # Create Patrick Witter as a participant
    patrick_user_id = str(uuid.uuid4())
    patrick_worker = next((w for w in all_workers if "Patrick" in w.get("name", "") and w.get("country") == "Jamaica"), None)
    if not patrick_worker:
        patrick_worker = {"id": str(uuid.uuid4()), "name": "Patrick Witter"}

    users = [
        {
            "id": ayo_user_id, "email": "ayo@realloc.ai", "password_hash": hash_password("admin123"),
            "name": "Ayo Omomia", "role": "super_admin",
            "enterprise_id": None, "cohort_id": None, "mentor_id": None,
            "personalized_track_name": None, "worker_id": None,
            "onboarding_completed": True, "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": neil_user_id, "email": "neil@sagicor.com", "password_hash": hash_password("demo123"),
            "name": "Neil", "role": "enterprise_admin",
            "enterprise_id": enterprise_id, "cohort_id": None, "mentor_id": None,
            "personalized_track_name": None, "worker_id": None,
            "onboarding_completed": True, "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": anna_user_id, "email": "anna.chen@sagicor.com", "password_hash": hash_password("demo123"),
            "name": "Anna (YueHua) Chen", "role": "participant",
            "enterprise_id": enterprise_id, "cohort_id": cohort_id, "mentor_id": mentor1_id,
            "personalized_track_name": "AI-Powered Application Modernization",
            "worker_id": anna_worker["id"],
            "onboarding_completed": True, "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": dennis_user_id, "email": "dennis.mcintosh@sagicor.com", "password_hash": hash_password("demo123"),
            "name": "Dennis McIntosh", "role": "participant",
            "enterprise_id": enterprise_id, "cohort_id": cohort_id, "mentor_id": mentor1_id,
            "personalized_track_name": dennis_track_name,
            "worker_id": dennis_worker_data["id"],
            "onboarding_completed": True, "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": mentor1_user_id, "email": "marcus@realloc.ai", "password_hash": hash_password("demo123"),
            "name": "Marcus Thompson", "role": "mentor",
            "enterprise_id": None, "cohort_id": cohort_id, "mentor_id": mentor1_id,
            "personalized_track_name": None, "worker_id": None,
            "onboarding_completed": True, "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": patrick_user_id, "email": "patrick.witter@sagicor.com", "password_hash": hash_password("demo123"),
            "name": "Patrick Witter", "role": "participant",
            "enterprise_id": enterprise_id, "cohort_id": cohort_id, "mentor_id": mentor1_id,
            "personalized_track_name": "AI-Powered Application Modernization",
            "worker_id": patrick_worker["id"],
            "onboarding_completed": True, "created_at": datetime.now(timezone.utc).isoformat()
        },
    ]
    await db.users.insert_many(users)

    # Update enterprise admin user IDs
    await db.enterprises.update_one({"id": enterprise_id}, {"$set": {"admin_user_ids": [neil_user_id, ayo_user_id]}})

    # ===== Cohorts =====
    cohort_participant_ids = [anna_user_id, dennis_user_id, patrick_user_id]
    # Add other builder core members as participants too
    additional_participant_ids = []
    for bc in BUILDER_CORE:
        if bc["name"] not in ["Anna (YueHua) Chen"]:
            bc_worker = next((w for w in all_workers if w["name"] == bc["name"]), None)
            if bc_worker:
                p_id = str(uuid.uuid4())
                additional_participant_ids.append(p_id)
                p_user = {
                    "id": p_id, "email": bc["email"], "password_hash": hash_password("demo123"),
                    "name": bc["name"], "role": "participant",
                    "enterprise_id": enterprise_id, "cohort_id": cohort_id,
                    "mentor_id": mentor1_id if bc["country"] == "Canada" else mentor2_id,
                    "personalized_track_name": bc.get("personalized_track_name", "AI Engineering Foundations"),
                    "worker_id": bc_worker["id"],
                    "onboarding_completed": True, "created_at": datetime.now(timezone.utc).isoformat()
                }
                await db.users.insert_one(p_user)
                # Update worker cohort_id
                await db.workers.update_one({"id": bc_worker["id"]}, {"$set": {"cohort_id": cohort_id}})

    # New hires
    nh1_id = str(uuid.uuid4())
    nh2_id = str(uuid.uuid4())
    new_hires = [
        {
            "id": nh1_id, "email": "newhire1@sagicor.com", "password_hash": hash_password("demo123"),
            "name": "New Hire 1", "role": "participant",
            "enterprise_id": enterprise_id, "cohort_id": cohort_id, "mentor_id": mentor2_id,
            "personalized_track_name": "AI Engineering Foundations", "worker_id": None,
            "onboarding_completed": True, "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": nh2_id, "email": "newhire2@sagicor.com", "password_hash": hash_password("demo123"),
            "name": "New Hire 2", "role": "participant",
            "enterprise_id": enterprise_id, "cohort_id": cohort_id, "mentor_id": mentor2_id,
            "personalized_track_name": "AI Engineering Foundations", "worker_id": None,
            "onboarding_completed": True, "created_at": datetime.now(timezone.utc).isoformat()
        },
    ]
    await db.users.insert_many(new_hires)

    all_cohort_participant_ids = cohort_participant_ids + additional_participant_ids + [nh1_id, nh2_id]

    cohorts = [
        {
            "id": cohort_id, "enterprise_id": enterprise_id, "name": "Cohort 1",
            "status": "active", "start_date": "2026-04-14", "end_date": "2026-07-07",
            "current_week": 0, "total_weeks": 12, "location": "Barbados",
            "mentor_ids": [mentor1_id, mentor2_id], "participant_ids": all_cohort_participant_ids,
            "business_outcomes": {
                "projected_cost_savings_annual": 450000,
                "projected_hours_reclaimed_weekly": 220,
                "projected_speed_improvement_pct": 45,
                "actual_cost_savings_annual": None,
                "actual_hours_reclaimed_weekly": None,
                "actual_speed_improvement_pct": None
            }
        },
        {
            "id": str(uuid.uuid4()), "enterprise_id": enterprise_id, "name": "Cohort 2",
            "status": "planned", "start_date": "2026-07-13", "end_date": "2026-10-05",
            "current_week": 0, "total_weeks": 12, "location": "TBD",
            "mentor_ids": [], "participant_ids": [],
            "business_outcomes": {"projected_cost_savings_annual": None, "projected_hours_reclaimed_weekly": None, "projected_speed_improvement_pct": None, "actual_cost_savings_annual": None, "actual_hours_reclaimed_weekly": None, "actual_speed_improvement_pct": None}
        },
        {
            "id": str(uuid.uuid4()), "enterprise_id": enterprise_id, "name": "Cohort 3",
            "status": "planned", "start_date": "2026-10-12", "end_date": "2027-01-04",
            "current_week": 0, "total_weeks": 12, "location": "TBD",
            "mentor_ids": [], "participant_ids": [],
            "business_outcomes": {"projected_cost_savings_annual": None, "projected_hours_reclaimed_weekly": None, "projected_speed_improvement_pct": None, "actual_cost_savings_annual": None, "actual_hours_reclaimed_weekly": None, "actual_speed_improvement_pct": None}
        },
        {
            "id": str(uuid.uuid4()), "enterprise_id": enterprise_id, "name": "Cohort 4",
            "status": "planned", "start_date": "2027-01-11", "end_date": "2027-04-05",
            "current_week": 0, "total_weeks": 12, "location": "TBD",
            "mentor_ids": [], "participant_ids": [],
            "business_outcomes": {"projected_cost_savings_annual": None, "projected_hours_reclaimed_weekly": None, "projected_speed_improvement_pct": None, "actual_cost_savings_annual": None, "actual_hours_reclaimed_weekly": None, "actual_speed_improvement_pct": None}
        },
    ]
    await db.cohorts.insert_many(cohorts)

    # ===== Anna's Curriculum =====
    anna_d1_id = str(uuid.uuid4())
    anna_d2_id = str(uuid.uuid4())
    anna_d3_id = str(uuid.uuid4())
    anna_d4_id = str(uuid.uuid4())

    anna_domains = [
        {"id": anna_d1_id, "participant_id": anna_user_id, "curriculum_id": "anna_curriculum",
         "title": "AI-Augmented Architecture Design", "description": "Learn to amplify your architecture strength with AI tools and patterns for enterprise modernization.",
         "weight_pct": 35, "order": 1, "why_assigned": "Your assessment identified architecture design as your strongest skill. This domain teaches you to amplify that strength with AI.", "task_count": 4},
        {"id": anna_d2_id, "participant_id": anna_user_id, "curriculum_id": "anna_curriculum",
         "title": "Production AI Deployment", "description": "Master the practices of deploying AI solutions in enterprise production environments.",
         "weight_pct": 25, "order": 2, "why_assigned": "Your modernization role requires production-grade AI deployment skills to lead enterprise transformation.", "task_count": 4},
        {"id": anna_d3_id, "participant_id": anna_user_id, "curriculum_id": "anna_curriculum",
         "title": "AI Workflow Automation", "description": "Build AI-powered workflow automation systems for enterprise development processes.",
         "weight_pct": 25, "order": 3, "why_assigned": "Automating development workflows will multiply your team's productivity and is a key growth area.", "task_count": 4},
        {"id": anna_d4_id, "participant_id": anna_user_id, "curriculum_id": "anna_curriculum",
         "title": "Capstone: Enterprise AI Solution", "description": "Design, build, and deploy a production AI solution that solves a real business problem.",
         "weight_pct": 15, "order": 4, "why_assigned": "Apply everything you have learned to create measurable business impact.", "task_count": 4},
    ]
    await db.domains.insert_many(anna_domains)

    # Anna's tasks for Domain 1
    anna_tasks_d1 = [
        {
            "id": str(uuid.uuid4()), "domain_id": anna_d1_id,
            "title": "AI Architecture Patterns for Legacy Systems",
            "description": "How AI components integrate into existing enterprise architectures without disrupting current operations.",
            "order": 1, "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "video_presenter": "Marcus Thompson, Former Meta Engineering Lead",
            "resources": [
                {"title": "Enterprise AI Architecture Patterns", "url": "https://example.com/ai-arch", "annotation": "Read sections 3-5 for the integration patterns you will use in the build exercise"},
                {"title": "Legacy System Modernization with AI", "url": "https://example.com/legacy-ai", "annotation": "Focus on the strangler fig pattern for incremental AI adoption"},
            ],
            "context_banner": "This module addresses your identified growth area: AI integration for modernization workflows. Your assessment showed strong architecture skills with a gap in AI-specific design patterns.",
            "practical_scenario": "You inherit a 15-year-old policy management system built on .NET Framework. The system processes 50,000 claims per month and any downtime costs $8,000 per hour. Your CTO wants to integrate AI-powered claim classification to reduce manual processing by 60%. The system has no microservices, no API layer, and the database schema has 847 tables with undocumented relationships. Design an architecture that integrates AI classification without requiring a full system rewrite, maintains 99.9% uptime during migration, and provides a rollback path if the AI model produces incorrect classifications.",
            "build_exercise": "Produce an architecture diagram and technical specification for integrating an AI classification layer into a legacy system. Include: component diagram, data flow, API contracts, rollback strategy, and monitoring plan.",
            "build_connection_to_capstone": "This architecture will form the foundation of your capstone project.",
            "is_published": True
        },
        {
            "id": str(uuid.uuid4()), "domain_id": anna_d1_id,
            "title": "Prompt Engineering for Code Analysis",
            "description": "Build production-grade prompt chains for automated code analysis and migration assessment.",
            "order": 2, "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "video_presenter": "Marcus Thompson, Former Meta Engineering Lead",
            "resources": [
                {"title": "Production Prompt Engineering", "url": "https://example.com/prompt-eng", "annotation": "Chapter 4 covers chain-of-thought patterns for code analysis"},
                {"title": "Code Analysis with LLMs", "url": "https://example.com/code-llm", "annotation": "Focus on the chunking strategies for large codebases"},
            ],
            "context_banner": "This module builds on your code modernization experience. Your assessment showed strong analytical skills that can be amplified with AI-powered code analysis.",
            "practical_scenario": "Your modernization team currently spends 30 hours per week manually reviewing legacy code modules to assess migration readiness. Each module review produces a priority score, dependency map, and estimated effort. The team reviews approximately 15 modules per week but the backlog has 200+ modules. Build a prompt chain that automates this assessment while maintaining the quality and nuance of human review.",
            "build_exercise": "Build a prompt chain that takes legacy code as input and produces: migration readiness score, dependency analysis, effort estimation, and priority ranking. Test against at least 3 different code samples.",
            "build_connection_to_capstone": "This prompt chain becomes a core component of your capstone AI code migration tool.",
            "is_published": True
        },
        {
            "id": str(uuid.uuid4()), "domain_id": anna_d1_id,
            "title": "AI Code Review Agent Design",
            "description": "Design an AI agent that performs automated code reviews with contextual understanding.",
            "order": 3, "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "video_presenter": "Marcus Thompson, Former Meta Engineering Lead",
            "resources": [
                {"title": "AI Agent Architecture", "url": "https://example.com/ai-agents", "annotation": "Sections on tool-use agents are most relevant to code review automation"},
                {"title": "Building Reliable AI Systems", "url": "https://example.com/reliable-ai", "annotation": "Focus on error handling and graceful degradation patterns"},
            ],
            "context_banner": "This module leverages your team mentoring and code review experience. AI can augment your review process to scale quality across larger teams.",
            "practical_scenario": "Your team of 8 developers produces an average of 25 pull requests per day. Code reviews are a bottleneck, with reviews taking 2-4 hours each and senior developers spending 40% of their time reviewing others' code. Design an AI agent that performs first-pass code reviews, catching common issues, enforcing coding standards, and flagging architectural concerns, so that human reviewers can focus on business logic and design decisions.",
            "build_exercise": "Design and document an AI code review agent: architecture diagram, prompt templates for different review types, integration plan with existing Git workflow, and quality metrics.",
            "build_connection_to_capstone": "This agent design integrates into your capstone as part of the AI-augmented development workflow.",
            "is_published": True
        },
        {
            "id": str(uuid.uuid4()), "domain_id": anna_d1_id,
            "title": "Enterprise AI Governance Framework",
            "description": "Establish governance, monitoring, and quality controls for AI systems in enterprise environments.",
            "order": 4, "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "video_presenter": "Sarah Kim, Former OpenAI Practitioner",
            "resources": [
                {"title": "AI Governance for Enterprises", "url": "https://example.com/ai-governance", "annotation": "The risk assessment matrix in chapter 6 is directly applicable to your governance document"},
                {"title": "Production AI Monitoring", "url": "https://example.com/ai-monitoring", "annotation": "Key metrics section defines the monitoring KPIs you will need"},
            ],
            "context_banner": "Your leadership role requires you to establish the governance framework your team and organization will follow for AI adoption.",
            "practical_scenario": "Your organization is about to deploy its first AI system into production: the code analysis tool you built in earlier tasks. The CTO wants a governance framework before deployment. Legal is concerned about AI-generated code introducing liability. The security team needs to understand data flow. Business stakeholders want to know how AI decisions will be audited.",
            "build_exercise": "Create an enterprise AI governance document covering: approval workflow for AI deployments, monitoring requirements, audit procedures, incident response for AI failures, and data privacy controls.",
            "build_connection_to_capstone": "This governance framework ensures your capstone project meets enterprise deployment standards.",
            "is_published": True
        },
    ]
    await db.tasks.insert_many(anna_tasks_d1)

    # Simplified tasks for remaining Anna domains
    for domain_id, domain_title in [(anna_d2_id, "Production AI Deployment"), (anna_d3_id, "AI Workflow Automation"), (anna_d4_id, "Capstone")]:
        task_titles = {
            anna_d2_id: ["CI/CD for AI Models", "AI Model Monitoring and Observability", "Cost Optimization for AI Services", "Production Rollback Strategies"],
            anna_d3_id: ["Workflow Automation Design", "AI Agent Orchestration", "Enterprise Integration Patterns", "Automation Testing and Validation"],
            anna_d4_id: ["Capstone: Problem Definition and Scoping", "Capstone: Solution Architecture", "Capstone: Implementation Sprint", "Capstone: Deployment and Measurement"],
        }
        for i, title in enumerate(task_titles[domain_id]):
            task = {
                "id": str(uuid.uuid4()), "domain_id": domain_id,
                "title": title, "description": f"Complete task for {domain_title}: {title}.",
                "order": i + 1, "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                "video_presenter": "Marcus Thompson, Former Meta Engineering Lead",
                "resources": [{"title": f"Resource for {title}", "url": "https://example.com/resource", "annotation": "Key reference material for this task"}],
                "context_banner": f"This task is part of your {domain_title} domain, building on your assessment results.",
                "practical_scenario": f"A scenario relevant to {title} in the context of enterprise AI deployment at Sagicor.",
                "build_exercise": f"Complete the build exercise for {title}. Detailed deliverables and evaluation criteria.",
                "build_connection_to_capstone": "This work connects directly to your capstone project.",
                "is_published": True
            }
            await db.tasks.insert_one(task)

    # ===== Dennis's Curriculum =====
    dennis_d1_id = str(uuid.uuid4())
    dennis_d2_id = str(uuid.uuid4())
    dennis_d3_id = str(uuid.uuid4())
    dennis_d4_id = str(uuid.uuid4())

    dennis_domains = [
        {"id": dennis_d1_id, "participant_id": dennis_user_id, "curriculum_id": "dennis_curriculum",
         "title": "Data Architecture for AI Systems", "description": "Design data architectures that serve both traditional analytics and AI/ML workloads.",
         "weight_pct": 35, "order": 1, "why_assigned": "Your data engineering background positions you to lead AI-ready data infrastructure design.", "task_count": 4},
        {"id": dennis_d2_id, "participant_id": dennis_user_id, "curriculum_id": "dennis_curriculum",
         "title": "AI-Augmented Data Engineering", "description": "Build AI-powered data pipelines and quality systems.",
         "weight_pct": 25, "order": 2, "why_assigned": "Enhance your data engineering skills with AI-powered automation and monitoring.", "task_count": 4},
        {"id": dennis_d3_id, "participant_id": dennis_user_id, "curriculum_id": "dennis_curriculum",
         "title": "Data Governance for AI", "description": "Establish governance frameworks for data quality, privacy, and AI model management.",
         "weight_pct": 25, "order": 3, "why_assigned": "Data governance is critical for responsible AI deployment in financial services.", "task_count": 4},
        {"id": dennis_d4_id, "participant_id": dennis_user_id, "curriculum_id": "dennis_curriculum",
         "title": "Capstone: AI Data Platform", "description": "Build and deploy an AI-ready data platform component.",
         "weight_pct": 15, "order": 4, "why_assigned": "Apply your data infrastructure skills to create measurable business impact.", "task_count": 4},
    ]
    await db.domains.insert_many(dennis_domains)

    for domain_id in [dennis_d1_id, dennis_d2_id, dennis_d3_id, dennis_d4_id]:
        task_map = {
            dennis_d1_id: ["Vector Database Design", "Data Lake Architecture for AI", "Real-time Data Pipelines", "Schema Design for AI Consumption"],
            dennis_d2_id: ["AI-Powered ETL Pipelines", "Data Quality Automation", "Feature Store Implementation", "Data Pipeline Monitoring"],
            dennis_d3_id: ["Data Privacy for AI Systems", "Model Data Lineage", "Compliance Automation", "Data Access Control"],
            dennis_d4_id: ["Capstone: Data Platform Scoping", "Capstone: Architecture Design", "Capstone: Implementation", "Capstone: Deployment"],
        }
        for i, title in enumerate(task_map[domain_id]):
            task = {
                "id": str(uuid.uuid4()), "domain_id": domain_id,
                "title": title, "description": f"Complete task: {title}.",
                "order": i + 1, "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                "video_presenter": "David Okafor, Former NVIDIA AI Specialist",
                "resources": [{"title": f"Resource for {title}", "url": "https://example.com/resource", "annotation": "Key reference for this task"}],
                "context_banner": f"This task connects to your data infrastructure assessment results.",
                "practical_scenario": f"A real-world scenario involving {title} at an enterprise scale.",
                "build_exercise": f"Build exercise for {title} with clear deliverables.",
                "build_connection_to_capstone": "Contributes to your capstone AI data platform.",
                "is_published": True
            }
            await db.tasks.insert_one(task)

    # ===== Generate mini-curricula for other builder core participants =====
    bc_curriculum_map = {
        "Eugene McDermott": {"track": "AI-Enhanced Risk Intelligence", "domains": ["AI Risk Assessment", "Compliance Automation", "BCM with AI", "Capstone: Risk Intelligence"]},
        "Karen McCulloch": {"track": "AI-Integrated Business Systems", "domains": ["AI for Enterprise Systems", "Process Automation", "Integration Design", "Capstone: Smart Systems"]},
        "Carol Blackwood": {"track": "AI Data Strategy", "domains": ["AI-Augmented Analytics", "Data Governance", "ML Fundamentals", "Capstone: Data Strategy"]},
        "Aftab Siddiqi": {"track": "AI-Powered Enterprise Systems", "domains": ["ERP AI Integration", "Process Mining", "Automation Design", "Capstone: Smart ERP"]},
        "Ivan (Ho Wai) Tang": {"track": "AI-Augmented Web Services", "domains": ["AI UX Patterns", "Web AI Integration", "Performance AI", "Capstone: Smart Web"]},
        "Charis Pringle": {"track": "AI Leadership for Application Services", "domains": ["AI Strategy", "Team AI Adoption", "AI Governance", "Capstone: AI Leadership"]},
        "Kelly Donnet": {"track": "AI-Enhanced Infrastructure", "domains": ["AI Network Monitoring", "Predictive Infrastructure", "Cloud AI Ops", "Capstone: Smart Infra"]},
    }
    bc_task_templates = ["Foundation Concepts", "Practical Application", "Advanced Patterns", "Integration Exercise"]
    for bc_name, curriculum in bc_curriculum_map.items():
        bc_user = await db.users.find_one({"name": bc_name, "role": "participant"}, {"_id": 0})
        if not bc_user:
            continue
        bc_domains = []
        for j, dtitle in enumerate(curriculum["domains"]):
            did = str(uuid.uuid4())
            bc_domains.append({"id": did, "participant_id": bc_user["id"], "curriculum_id": f"{bc_name.lower().replace(' ','_')}_curriculum",
                "title": dtitle, "description": f"Domain: {dtitle}",
                "weight_pct": [35, 25, 25, 15][j], "order": j + 1, "why_assigned": f"Based on your assessment results.", "task_count": 4})
        await db.domains.insert_many(bc_domains)
        for j, d in enumerate(bc_domains):
            for k, ttitle in enumerate(bc_task_templates):
                await db.tasks.insert_one({
                    "id": str(uuid.uuid4()), "domain_id": d["id"],
                    "title": f"{d['title']}: {ttitle}", "description": f"Task {k+1} for {d['title']}.",
                    "order": k + 1, "video_url": "https://www.youtube.com/embed/placeholder",
                    "video_presenter": "Marcus Thompson, Former Meta Engineering Lead",
                    "resources": [], "context_banner": f"Part of your {curriculum['track']} program.",
                    "practical_scenario": f"Apply {ttitle.lower()} in an enterprise context.", "build_exercise": f"Complete the {ttitle.lower()} exercise.",
                    "build_connection_to_capstone": "Connects to your capstone.", "is_published": True
                })
            # Add progress for first domain tasks (simulate partial completion)
            if j == 0:
                d_tasks = await db.tasks.find({"domain_id": d["id"]}, {"_id": 0}).sort("order", 1).to_list(4)
                completed_count = random.randint(1, 3)
                for ti, dt in enumerate(d_tasks):
                    st = "completed" if ti < completed_count else ("in_progress" if ti == completed_count else "available")
                    await db.progress.insert_one({"id": str(uuid.uuid4()), "user_id": bc_user["id"], "task_id": dt["id"],
                        "domain_id": d["id"], "cohort_id": cohort_id, "status": st,
                        "completed_at": datetime.now(timezone.utc).isoformat() if st == "completed" else None})

    # ===== Progress records =====
    anna_d1_tasks = await db.tasks.find({"domain_id": anna_d1_id}, {"_id": 0}).sort("order", 1).to_list(10)
    for i, t in enumerate(anna_d1_tasks):
        status = "completed" if i < 2 else ("in_progress" if i == 2 else "available" if i == 3 else "locked")
        await db.progress.insert_one({
            "id": str(uuid.uuid4()), "user_id": anna_user_id, "task_id": t["id"],
            "domain_id": anna_d1_id, "cohort_id": cohort_id,
            "status": status,
            "completed_at": datetime.now(timezone.utc).isoformat() if status == "completed" else None
        })

    # ===== Submissions =====
    anna_t1 = anna_d1_tasks[0] if len(anna_d1_tasks) > 0 else None
    anna_t2 = anna_d1_tasks[1] if len(anna_d1_tasks) > 1 else None
    anna_t3 = anna_d1_tasks[2] if len(anna_d1_tasks) > 2 else None

    submissions = []
    if anna_t1:
        submissions.append({
            "id": str(uuid.uuid4()), "user_id": anna_user_id, "task_id": anna_t1["id"],
            "domain_id": anna_d1_id, "cohort_id": cohort_id,
            "title": "AI Integration Architecture for Legacy Policy System",
            "description": "Architecture diagram and technical specification for integrating AI classification into legacy .NET policy system.",
            "project_url": "https://github.com/annachen/ai-architecture-spec",
            "notes": "Includes component diagram, data flow, rollback strategy, and monitoring plan.",
            "status": "pass",
            "admin_feedback": "Excellent architecture design. Clean separation between AI and legacy layers. Good fallback strategy. One suggestion: add a circuit breaker pattern for the AI API calls to handle upstream failures gracefully. Overall, this is production-ready thinking.",
            "reviewer_name": "Marcus Thompson", "reviewer_credential": "Former Meta Engineering Lead",
            "review_cycle": 1, "created_at": (datetime.now(timezone.utc) - timedelta(days=7)).isoformat(),
            "reviewed_at": (datetime.now(timezone.utc) - timedelta(days=6)).isoformat()
        })
    if anna_t2:
        submissions.append({
            "id": str(uuid.uuid4()), "user_id": anna_user_id, "task_id": anna_t2["id"],
            "domain_id": anna_d1_id, "cohort_id": cohort_id,
            "title": "Prompt Chain for Code Migration Analysis",
            "description": "Prompt chain for automated legacy code migration assessment.",
            "project_url": "https://github.com/annachen/prompt-chain-v1",
            "notes": "First submission - happy path implementation.",
            "status": "needs_work",
            "admin_feedback": "Your prompt chain handles the happy path well but doesn't account for modules with circular dependencies. Also, your priority scoring focuses only on technical debt. In enterprise modernization, a module with low technical debt but high business impact should still rank high. Revise the scoring prompt and add dependency cycle detection.",
            "reviewer_name": "Marcus Thompson", "reviewer_credential": "Former Meta Engineering Lead",
            "review_cycle": 1, "created_at": (datetime.now(timezone.utc) - timedelta(days=5)).isoformat(),
            "reviewed_at": (datetime.now(timezone.utc) - timedelta(days=4)).isoformat()
        })
        submissions.append({
            "id": str(uuid.uuid4()), "user_id": anna_user_id, "task_id": anna_t2["id"],
            "domain_id": anna_d1_id, "cohort_id": cohort_id,
            "title": "Prompt Chain for Code Migration Analysis (Revised)",
            "description": "Revised prompt chain with circular dependency detection and business impact scoring.",
            "project_url": "https://github.com/annachen/prompt-chain-v2",
            "notes": "Revised with business impact weighting and circular dependency detection.",
            "status": "pass",
            "admin_feedback": "Much improved. The business impact weighting is well-calibrated and the circular dependency detection works cleanly. This is the kind of prompt engineering that separates demo-grade from production-grade work.",
            "reviewer_name": "Marcus Thompson", "reviewer_credential": "Former Meta Engineering Lead",
            "review_cycle": 2, "created_at": (datetime.now(timezone.utc) - timedelta(days=2)).isoformat(),
            "reviewed_at": (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()
        })
    if anna_t3:
        submissions.append({
            "id": str(uuid.uuid4()), "user_id": anna_user_id, "task_id": anna_t3["id"],
            "domain_id": anna_d1_id, "cohort_id": cohort_id,
            "title": "Code Review Agent Design",
            "description": "AI code review agent architecture and prompt templates.",
            "project_url": "https://github.com/annachen/code-review-agent",
            "notes": "Submitted for review.",
            "status": "pending",
            "admin_feedback": None, "reviewer_name": None, "reviewer_credential": None,
            "review_cycle": 1, "created_at": (datetime.now(timezone.utc) - timedelta(hours=2)).isoformat(),
            "reviewed_at": None
        })

    # Patrick's submissions
    patrick_d1_tasks = anna_d1_tasks  # Patrick uses same curriculum
    if patrick_d1_tasks and len(patrick_d1_tasks) > 0:
        submissions.append({
            "id": str(uuid.uuid4()), "user_id": patrick_user_id, "task_id": patrick_d1_tasks[0]["id"],
            "domain_id": anna_d1_id, "cohort_id": cohort_id,
            "title": "Solutions Architecture for AI Agent Integration",
            "description": "Architecture for connecting AI agents to legacy SOAP APIs using Adapter and Facade patterns.",
            "project_url": "https://github.com/patrickwitter/ai-solutions-arch",
            "notes": "Includes phased rollout plan.",
            "status": "pass",
            "admin_feedback": "Strong architectural thinking. Your use of the Adapter pattern for connecting AI agents to legacy SOAP APIs shows real solutions engineering depth. The phased rollout plan is particularly impressive.",
            "reviewer_name": "Marcus Thompson", "reviewer_credential": "Former Meta Engineering Lead",
            "review_cycle": 1, "created_at": (datetime.now(timezone.utc) - timedelta(days=6)).isoformat(),
            "reviewed_at": (datetime.now(timezone.utc) - timedelta(days=5)).isoformat()
        })
    if patrick_d1_tasks and len(patrick_d1_tasks) > 1:
        submissions.append({
            "id": str(uuid.uuid4()), "user_id": patrick_user_id, "task_id": patrick_d1_tasks[1]["id"],
            "domain_id": anna_d1_id, "cohort_id": cohort_id,
            "title": "Prompt Chain for Large Codebase Analysis",
            "description": "Prompt chain for analyzing enterprise codebases.",
            "project_url": "https://github.com/patrickwitter/prompt-chain",
            "notes": "Initial implementation.",
            "status": "needs_work",
            "admin_feedback": "The prompt chain produces good results on small inputs but has no chunking strategy for large codebases. At 50,000+ lines, this will timeout or produce inconsistent results. Design a map-reduce approach: split by module boundary, analyze each independently, then synthesize. Resubmit.",
            "reviewer_name": "Marcus Thompson", "reviewer_credential": "Former Meta Engineering Lead",
            "review_cycle": 1, "created_at": (datetime.now(timezone.utc) - timedelta(days=2)).isoformat(),
            "reviewed_at": (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()
        })

    if submissions:
        await db.submissions.insert_many(submissions)

    # ===== Business Case =====
    await db.business_cases.insert_one({
        "id": str(uuid.uuid4()), "participant_id": anna_user_id, "cohort_id": cohort_id,
        "problem": "Manual legacy code analysis takes 30 hours per week across the modernization team",
        "current_state": "Two senior developers spend 15 hours each per week manually reviewing legacy code for migration readiness. Each review produces a priority score, dependency map, and effort estimate.",
        "proposed_solution": "AI-powered code analysis pipeline that automatically assesses migration readiness, identifies dependencies, and generates refactoring priorities",
        "outcome_category": "cost_reduction",
        "projected_impact": {"hours_saved_weekly": 25, "cost_saved_quarterly": 16250, "annual_savings": 65000},
        "status": "draft", "mentor_approved": False, "mentor_feedback": None,
        "actual_impact": None, "measured_at": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    })

    # ===== Discussion Threads =====
    threads = [
        {
            "id": str(uuid.uuid4()), "task_id": anna_t2["id"] if anna_t2 else None, "cohort_id": cohort_id,
            "author_id": next((u["id"] for u in users if "Ivan" in u.get("name", "")), anna_user_id),
            "author_name": "Ivan Tang", "author_role": "participant",
            "content": "Has anyone found a good pattern for connecting AI agents to legacy SOAP APIs? Our systems are all XML-based.",
            "replies": [
                {"id": str(uuid.uuid4()), "author_id": mentor1_user_id, "author_name": "Marcus Thompson", "author_role": "mentor", "author_credential": "Former Meta Engineering Lead",
                 "content": "At Meta we used an adapter layer pattern. Build a lightweight REST wrapper around your SOAP endpoints, then connect your agents to the REST layer. This keeps your AI code clean and your legacy integration isolated. I will share a reference architecture in our next session.",
                 "created_at": (datetime.now(timezone.utc) - timedelta(days=3)).isoformat()},
                {"id": str(uuid.uuid4()), "author_id": patrick_user_id, "author_name": "Patrick Witter", "author_role": "participant", "author_credential": None,
                 "content": "I have been working on something similar. The Facade pattern works well here. You can abstract the entire SOAP complexity behind a clean interface that your AI agents consume. Happy to pair on this.",
                 "created_at": (datetime.now(timezone.utc) - timedelta(days=2)).isoformat()},
            ],
            "upvotes": 5, "created_at": (datetime.now(timezone.utc) - timedelta(days=4)).isoformat()
        },
        {
            "id": str(uuid.uuid4()), "task_id": None, "cohort_id": cohort_id,
            "author_id": anna_user_id, "author_name": "Charis Pringle", "author_role": "participant",
            "content": "How do you handle rate limiting when deploying AI services that multiple teams need to access simultaneously?",
            "replies": [
                {"id": str(uuid.uuid4()), "author_id": mentor2_user_id, "author_name": "David Okafor", "author_role": "mentor", "author_credential": "Former NVIDIA AI Specialist",
                 "content": "Token bucket with per-team quotas. At NVIDIA we learned the hard way that a single global rate limit causes priority inversions. Give each team a guaranteed baseline allocation with burst capacity. I will walk through the implementation pattern in this week's group session.",
                 "created_at": (datetime.now(timezone.utc) - timedelta(days=2)).isoformat()},
            ],
            "upvotes": 3, "created_at": (datetime.now(timezone.utc) - timedelta(days=3)).isoformat()
        },
        {
            "id": str(uuid.uuid4()), "task_id": anna_d1_tasks[3]["id"] if len(anna_d1_tasks) > 3 else None, "cohort_id": cohort_id,
            "author_id": anna_user_id, "author_name": "Anna Chen", "author_role": "participant",
            "content": "My team has two developers who are skeptical about AI-augmented workflows. They see it as a threat rather than a tool. Any experience handling this?",
            "replies": [
                {"id": str(uuid.uuid4()), "author_id": mentor1_user_id, "author_name": "Marcus Thompson", "author_role": "mentor", "author_credential": "Former Meta Engineering Lead",
                 "content": "Very common. The key is giving them control. Let them choose which workflows to augment first. Start with something they find tedious, not something they find meaningful. When AI removes their most hated task, they become advocates. I have a case study from Meta I will share.",
                 "created_at": (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()},
                {"id": str(uuid.uuid4()), "author_id": anna_user_id, "author_name": "Karen McCulloch", "author_role": "participant", "author_credential": None,
                 "content": "I had a similar situation during our last system migration. What worked was pairing skeptics with early adopters on a small pilot. The skeptics saw the results firsthand without feeling forced.",
                 "created_at": (datetime.now(timezone.utc) - timedelta(hours=12)).isoformat()},
            ],
            "upvotes": 7, "created_at": (datetime.now(timezone.utc) - timedelta(days=2)).isoformat()
        },
        {
            "id": str(uuid.uuid4()), "task_id": None, "cohort_id": cohort_id,
            "author_id": anna_user_id, "author_name": "Otis Kidd", "author_role": "participant",
            "content": "For those of us on the infrastructure side, what cloud monitoring tools work best for tracking AI service health alongside traditional infrastructure metrics?",
            "replies": [
                {"id": str(uuid.uuid4()), "author_id": mentor2_user_id, "author_name": "David Okafor", "author_role": "mentor", "author_credential": "Former NVIDIA AI Specialist",
                 "content": "Grafana with a custom AI metrics dashboard. Track latency, cost per request, output quality score, and model version alongside your standard CPU/memory/network. The AI-specific metrics are what catch problems that traditional monitoring misses.",
                 "created_at": (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()},
            ],
            "upvotes": 2, "created_at": (datetime.now(timezone.utc) - timedelta(days=2)).isoformat()
        },
        {
            "id": str(uuid.uuid4()), "task_id": None, "cohort_id": cohort_id,
            "author_id": dennis_user_id, "author_name": "Dennis McIntosh", "author_role": "participant",
            "content": "When designing data schemas for AI consumption, should I prioritize query speed or storage efficiency? Our current schemas are optimized for transactional workloads.",
            "replies": [
                {"id": str(uuid.uuid4()), "author_id": mentor3_user_id, "author_name": "Sarah Kim", "author_role": "mentor", "author_credential": "Former OpenAI Practitioner",
                 "content": "For AI workloads, read optimization almost always wins. AI inference hits the database with complex analytical queries, not simple key lookups. Consider a separate analytics schema or materialized views that reshape your transactional data for AI consumption. Keep your transactional schema clean.",
                 "created_at": (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()},
            ],
            "upvotes": 4, "created_at": (datetime.now(timezone.utc) - timedelta(days=2)).isoformat()
        },
    ]
    await db.discussion_threads.insert_many(threads)

    # ===== Mentor Sessions =====
    sessions = [
        {"id": str(uuid.uuid4()), "mentor_id": mentor1_id, "participant_id": anna_user_id, "cohort_id": cohort_id,
         "date": "2026-03-13", "time": "14:00", "timezone": "EST", "status": "completed", "meeting_url": "https://meet.google.com/abc-def-ghi",
         "notes": "Discussed AI architecture patterns for .NET legacy systems. Anna shared her current modernization approach. Identified three workflows where AI can accelerate migration assessment. Action: Anna to draft architecture diagram for Task 1.1.",
         "created_at": (datetime.now(timezone.utc) - timedelta(days=14)).isoformat()},
        {"id": str(uuid.uuid4()), "mentor_id": mentor1_id, "participant_id": anna_user_id, "cohort_id": cohort_id,
         "date": "2026-03-20", "time": "14:00", "timezone": "EST", "status": "completed", "meeting_url": "https://meet.google.com/abc-def-ghi",
         "notes": "Reviewed Task 1.2 submission. Prompt chain needs revision for circular dependencies and business impact scoring. Discussed Meta's approach to code migration tooling. Action: revise and resubmit.",
         "created_at": (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()},
        {"id": str(uuid.uuid4()), "mentor_id": mentor1_id, "participant_id": anna_user_id, "cohort_id": cohort_id,
         "date": "2026-03-27", "time": "14:00", "timezone": "EST", "status": "scheduled", "meeting_url": "https://meet.google.com/abc-def-ghi",
         "notes": None, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "mentor_id": mentor1_id, "participant_id": patrick_user_id, "cohort_id": cohort_id,
         "date": "2026-03-14", "time": "10:00", "timezone": "EST", "status": "completed", "meeting_url": "https://meet.google.com/jkl-mno-pqr",
         "notes": "Reviewed Patrick's solutions architecture for AI agent integration. Strong design patterns thinking. Discussed Facade and Adapter patterns for legacy API integration. Action: Patrick to build proof of concept for Task 1.1.",
         "created_at": (datetime.now(timezone.utc) - timedelta(days=13)).isoformat()},
        {"id": str(uuid.uuid4()), "mentor_id": mentor2_id, "participant_id": anna_user_id, "cohort_id": cohort_id,
         "date": "2026-03-15", "time": "11:00", "timezone": "EST", "status": "completed", "meeting_url": "https://meet.google.com/stu-vwx-yza",
         "notes": "Discussed infrastructure requirements for AI service deployment at Sagicor. Reviewed current monitoring stack. Identified gaps in AI-specific observability. Action: Otis to audit current monitoring for AI readiness.",
         "created_at": (datetime.now(timezone.utc) - timedelta(days=12)).isoformat()},
        {"id": str(uuid.uuid4()), "mentor_id": mentor2_id, "participant_id": anna_user_id, "cohort_id": cohort_id,
         "date": "2026-03-22", "time": "11:00", "timezone": "EST", "status": "scheduled", "meeting_url": "https://meet.google.com/stu-vwx-yza",
         "notes": None, "created_at": datetime.now(timezone.utc).isoformat()},
    ]
    await db.mentor_sessions.insert_many(sessions)

    # ===== Activity Feed =====
    now = datetime.now(timezone.utc)
    feed = [
        {"id": str(uuid.uuid4()), "cohort_id": cohort_id, "type": "submission", "actor_name": "Anna Chen", "actor_role": "participant",
         "content": "submitted Domain 1, Task 1.3: Code Review Agent Design", "created_at": (now - timedelta(hours=2)).isoformat()},
        {"id": str(uuid.uuid4()), "cohort_id": cohort_id, "type": "feedback", "actor_name": "Marcus Thompson", "actor_role": "mentor",
         "content": "posted feedback on Patrick Witter's Domain 1, Task 1.2", "created_at": (now - timedelta(hours=5)).isoformat()},
        {"id": str(uuid.uuid4()), "cohort_id": cohort_id, "type": "completion", "actor_name": "Charis Pringle", "actor_role": "participant",
         "content": "completed Domain 1, Task 1.1", "created_at": (now - timedelta(hours=8)).isoformat()},
        {"id": str(uuid.uuid4()), "cohort_id": cohort_id, "type": "submission", "actor_name": "Ivan Tang", "actor_role": "participant",
         "content": "started Domain 1, Task 1.3", "created_at": (now - timedelta(days=1)).isoformat()},
        {"id": str(uuid.uuid4()), "cohort_id": cohort_id, "type": "feedback", "actor_name": "Anna Chen", "actor_role": "participant",
         "content": "received Pass on Domain 1, Task 1.2 (revision)", "created_at": (now - timedelta(days=1, hours=2)).isoformat()},
        {"id": str(uuid.uuid4()), "cohort_id": cohort_id, "type": "submission", "actor_name": "Dennis McIntosh", "actor_role": "participant",
         "content": "submitted Domain 1, Task 1.1", "created_at": (now - timedelta(days=1, hours=5)).isoformat()},
        {"id": str(uuid.uuid4()), "cohort_id": cohort_id, "type": "milestone", "actor_name": "Marcus Thompson", "actor_role": "mentor",
         "content": "completed mentor session with Anna Chen", "created_at": (now - timedelta(days=2)).isoformat()},
        {"id": str(uuid.uuid4()), "cohort_id": cohort_id, "type": "submission", "actor_name": "Patrick Witter", "actor_role": "participant",
         "content": "submitted Domain 1, Task 1.2", "created_at": (now - timedelta(days=2, hours=3)).isoformat()},
        {"id": str(uuid.uuid4()), "cohort_id": cohort_id, "type": "completion", "actor_name": "Karen McCulloch", "actor_role": "participant",
         "content": "completed Domain 1, Task 1.1", "created_at": (now - timedelta(days=3)).isoformat()},
        {"id": str(uuid.uuid4()), "cohort_id": cohort_id, "type": "submission", "actor_name": "Otis Kidd", "actor_role": "participant",
         "content": "started Domain 1, Task 1.2", "created_at": (now - timedelta(days=3, hours=4)).isoformat()},
        {"id": str(uuid.uuid4()), "cohort_id": cohort_id, "type": "milestone", "actor_name": "David Okafor", "actor_role": "mentor",
         "content": "completed mentor session with Otis Kidd", "created_at": (now - timedelta(days=4)).isoformat()},
        {"id": str(uuid.uuid4()), "cohort_id": cohort_id, "type": "submission", "actor_name": "Clarence Chai", "actor_role": "participant",
         "content": "submitted Domain 1, Task 1.1", "created_at": (now - timedelta(days=4, hours=2)).isoformat()},
        {"id": str(uuid.uuid4()), "cohort_id": cohort_id, "type": "milestone", "actor_name": "System", "actor_role": "system",
         "content": "Cohort 1 milestone: 8 of 12 participants have completed Task 1.1", "created_at": (now - timedelta(days=5)).isoformat()},
        {"id": str(uuid.uuid4()), "cohort_id": cohort_id, "type": "completion", "actor_name": "Aftab Siddiqi", "actor_role": "participant",
         "content": "completed onboarding", "created_at": (now - timedelta(weeks=1)).isoformat()},
        {"id": str(uuid.uuid4()), "cohort_id": cohort_id, "type": "milestone", "actor_name": "System", "actor_role": "system",
         "content": "Cohort 1 launched. 12 participants. Barbados boot camp scheduled April 14.", "created_at": (now - timedelta(weeks=1, days=1)).isoformat()},
    ]
    await db.activity_feed.insert_many(feed)

    # ===== Notifications =====
    notifications = [
        # Neil's notifications
        {"id": str(uuid.uuid4()), "user_id": neil_user_id, "type": "info",
         "content": "3 new assessment completions today. Builder core updated.", "read": False,
         "created_at": (now - timedelta(hours=2)).isoformat()},
        {"id": str(uuid.uuid4()), "user_id": neil_user_id, "type": "submission",
         "content": "Anna Chen submitted Domain 1, Task 1.3 for review.", "read": False,
         "created_at": (now - timedelta(hours=2)).isoformat()},
        {"id": str(uuid.uuid4()), "user_id": neil_user_id, "type": "milestone",
         "content": "Cohort 1: 67% of participants have completed Domain 1, Task 1.1.", "read": False,
         "created_at": (now - timedelta(days=1)).isoformat()},
        # Anna's notifications
        {"id": str(uuid.uuid4()), "user_id": anna_user_id, "type": "feedback",
         "content": "Mentor feedback posted on your Domain 1, Task 1.2 submission.", "read": False,
         "created_at": (now - timedelta(days=1)).isoformat()},
        {"id": str(uuid.uuid4()), "user_id": anna_user_id, "type": "session",
         "content": "Next mentor session: Thursday March 27, 2pm EST with Marcus Thompson.", "read": False,
         "created_at": (now - timedelta(days=1)).isoformat()},
    ]
    await db.notifications.insert_many(notifications)

    return {"message": "Seed data created successfully", "enterprise_id": enterprise_id, "cohort_id": cohort_id, "workers": 587}
