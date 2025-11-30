
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase Auth)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  role text check (role in ('student', 'teacher', 'admin')) default 'student',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Courses table
create table courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  instructor_id uuid references profiles(id),
  thumbnail_url text,
  category text,
  level text,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Lessons table
create table lessons (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  content text, -- Markdown content
  video_url text,
  transcript text,
  "order" integer,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enrollments table
create table enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, course_id)
);

-- Assignments table
create table assignments (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  description text,
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Submissions table
create table submissions (
  id uuid default uuid_generate_v4() primary key,
  assignment_id uuid references assignments(id) on delete cascade,
  student_id uuid references profiles(id) on delete cascade,
  content text, -- Link or text submission
  status text check (status in ('pending', 'graded')) default 'pending',
  grade integer,
  feedback text,
  submitted_at timestamp with time zone default timezone('utc'::text, now())
);

-- Questions table (for AI/Teacher Q&A)
create table questions (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references courses(id) on delete cascade,
  student_id uuid references profiles(id) on delete cascade,
  question text not null,
  ai_answer text,
  teacher_answer text,
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
