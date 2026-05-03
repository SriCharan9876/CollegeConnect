-- ======================
-- RESET
-- ======================
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS college_exams;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS colleges;
DROP TABLE IF EXISTS exams;

-- ======================
-- TABLES
-- ======================

CREATE TABLE colleges (
  id SERIAL PRIMARY KEY,
  name TEXT,
  location TEXT,
  rating FLOAT,
  avg_placement FLOAT,
  established_year INT,
  description TEXT,
  type TEXT
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  college_id INT REFERENCES colleges(id),
  name TEXT,
  fees INT,
  duration TEXT
);

CREATE TABLE exams (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE
);

CREATE TABLE college_exams (
  id SERIAL PRIMARY KEY,
  college_id INT REFERENCES colleges(id),
  exam_id INT REFERENCES exams(id),
  cutoff_rank INT
);

-- USERS
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT,
  email TEXT UNIQUE,
  password TEXT
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  college_id INT REFERENCES colleges(id),
  user_id INT REFERENCES users(id),
  rating FLOAT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- SAVED COLLEGES
CREATE TABLE saved_colleges (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  college_id INT REFERENCES colleges(id)
);

-- SAVED COMPARISONS
CREATE TABLE saved_comparisons (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  college_ids INT[]
);

-- QUESTIONS
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  college_id INT REFERENCES colleges(id),
  title TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ANSWERS
CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  question_id INT REFERENCES questions(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id),
  answer TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ======================
-- INDEXES
-- ======================

CREATE INDEX idx_college_location ON colleges(location);
CREATE INDEX idx_course_name ON courses(name);
CREATE INDEX idx_exam_name ON exams(name);

-- ======================
-- EXAMS
-- ======================

INSERT INTO exams (name) VALUES
('JEE Advanced'),
('JEE Main'),
('BITSAT'),
('VITEEE'),
('AEEE'),
('SRMJEEE');

-- ======================
-- COLLEGES
-- ======================

INSERT INTO colleges (name, location, rating, avg_placement, established_year, description, type)
VALUES
('IIT Delhi','Delhi',4.8,95,1961,'IIT Delhi is a premier institute known for top-tier placements, research opportunities, and strong academic culture.','Government'),
('IIT Bombay','Maharashtra',4.9,96,1958,'IIT Bombay offers world-class education, innovation culture, and excellent global exposure.','Government'),
('IIT Madras','Tamil Nadu',4.9,95,1959,'IIT Madras is renowned for research excellence and consistent top rankings.','Government'),
('IIT Kanpur','Uttar Pradesh',4.7,93,1959,'IIT Kanpur is known for rigorous academics and strong alumni network.','Government'),
('IIT Kharagpur','West Bengal',4.7,92,1951,'IIT Kharagpur provides diverse courses and innovation opportunities.','Government'),

('NIT Trichy','Tamil Nadu',4.5,90,1964,'NIT Trichy has excellent placements and strong technical programs.','Government'),
('NIT Surathkal','Karnataka',4.5,89,1960,'NIT Surathkal is popular for its coastal campus and placements.','Government'),
('NIT Warangal','Telangana',4.4,88,1959,'NIT Warangal is known for strong core engineering branches.','Government'),
('NIT Calicut','Kerala',4.3,85,1961,'NIT Calicut provides good infrastructure and placements.','Government'),
('NIT Rourkela','Odisha',4.4,87,1961,'NIT Rourkela is a research-oriented institute.','Government'),

('IIIT Hyderabad','Telangana',4.6,93,1998,'IIIT Hyderabad excels in AI, data science, and research.','Private'),
('IIIT Bangalore','Karnataka',4.5,92,1999,'IIIT Bangalore focuses on advanced computing programs.','Private'),
('IIIT Delhi','Delhi',4.4,90,2008,'IIIT Delhi emphasizes research-driven education.','Government'),
('IIIT Allahabad','Uttar Pradesh',4.4,91,1999,'IIIT Allahabad has strong IT placements.','Government'),

('BITS Pilani','Rajasthan',4.7,92,1964,'BITS Pilani is a top private institute with flexible academics.','Private'),
('BITS Goa','Goa',4.3,85,2004,'BITS Goa offers modern infrastructure and placements.','Private'),
('BITS Hyderabad','Telangana',4.3,85,2008,'BITS Hyderabad provides strong academic programs.','Private'),

('VIT Vellore','Tamil Nadu',4.3,85,1984,'VIT Vellore has strong placements and infrastructure.','Private'),
('VIT Chennai','Tamil Nadu',4.2,83,2010,'VIT Chennai offers good industry exposure.','Private'),
('VIT Bhopal','Madhya Pradesh',4.1,80,2017,'VIT Bhopal is a modern campus with growing opportunities.','Private'),
('VIT Amaravati','Andhra Pradesh',4.1,80,2017,'VIT Amaravati focuses on new-age education.','Private'),

('SRM Chennai','Tamil Nadu',4.2,83,1985,'SRM Chennai offers strong industry connections.','Private'),
('SRM Amaravati','Andhra Pradesh',4.1,80,2017,'SRM Amaravati provides good campus facilities.','Private'),
('SRM Lucknow','Uttar Pradesh',4.0,78,2005,'SRM Lucknow offers growing placement opportunities.','Private'),

('Amrita Coimbatore','Tamil Nadu',4.3,84,2002,'Amrita Coimbatore is known for academics and discipline.','Private'),
('Amrita Bengaluru','Karnataka',4.3,84,1996,'Amrita Bengaluru offers strong technical education.','Private'),
('Amrita Amritapuri','Kerala',4.2,83,1994,'Amrita Amritapuri emphasizes research and values.','Private');

-- ======================
-- EXAM MAPPING (FIXED - uses exam name lookup, not hardcoded IDs)
-- ======================

-- IITs → JEE Advanced
INSERT INTO college_exams (college_id, exam_id, cutoff_rank)
SELECT c.id, e.id, (100 + random()*800)::int
FROM colleges c, exams e
WHERE c.name LIKE 'IIT%' AND e.name = 'JEE Advanced';

-- NITs → JEE Main
INSERT INTO college_exams (college_id, exam_id, cutoff_rank)
SELECT c.id, e.id, (1000 + random()*8000)::int
FROM colleges c, exams e
WHERE c.name LIKE 'NIT%' AND e.name = 'JEE Main';

-- IIITs → JEE Main
INSERT INTO college_exams (college_id, exam_id, cutoff_rank)
SELECT c.id, e.id, (1000 + random()*8000)::int
FROM colleges c, exams e
WHERE c.name LIKE 'IIIT%' AND e.name = 'JEE Main';

-- BITS → BITSAT
INSERT INTO college_exams (college_id, exam_id, cutoff_rank)
SELECT c.id, e.id, (250 + random()*100)::int
FROM colleges c, exams e
WHERE c.name LIKE 'BITS%' AND e.name = 'BITSAT';

-- VIT → VITEEE
INSERT INTO college_exams (college_id, exam_id, cutoff_rank)
SELECT c.id, e.id, (5000 + random()*15000)::int
FROM colleges c, exams e
WHERE c.name LIKE 'VIT%' AND e.name = 'VITEEE';

-- Amrita → AEEE
INSERT INTO college_exams (college_id, exam_id, cutoff_rank)
SELECT c.id, e.id, (1000 + random()*5000)::int
FROM colleges c, exams e
WHERE c.name LIKE 'Amrita%' AND e.name = 'AEEE';

-- SRM → SRMJEEE
INSERT INTO college_exams (college_id, exam_id, cutoff_rank)
SELECT c.id, e.id, (5000 + random()*20000)::int
FROM colleges c, exams e
WHERE c.name LIKE 'SRM%' AND e.name = 'SRMJEEE';

-- ======================
-- COURSES
-- ======================

INSERT INTO courses (college_id, name, fees, duration)
SELECT c.id,
       course,
       (120000 + random()*200000)::int,
       '4 Years'
FROM colleges c,
LATERAL (
  SELECT unnest(
    CASE
      WHEN c.name LIKE 'IIT%' THEN ARRAY[
        'Computer Science Engineering',
        'Electrical Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Chemical Engineering'
      ]
      WHEN c.name LIKE 'NIT%' THEN ARRAY[
        'Computer Science Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Electronics Engineering'
      ]
      WHEN c.name LIKE 'IIIT%' THEN ARRAY[
        'Computer Science',
        'Artificial Intelligence',
        'Data Science'
      ]
      ELSE ARRAY[
        'Computer Science',
        'Information Technology',
        'Electronics Engineering'
      ]
    END
  ) AS course
) AS courses_list;
