-- 1. QUESTIONS (For AI/Teacher Q&A)
create table public.questions (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  question text not null,
  ai_answer text,
  teacher_answer text,
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. COURSE ASSIGNMENTS (Definitions created by teachers)
-- We use a distinct name to avoid conflict with your existing 'assignments' table
create table public.course_assignments (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  description text,
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. ASSIGNMENT SUBMISSIONS (Student work linked to definitions)
create table public.assignment_submissions (
  id uuid default uuid_generate_v4() primary key,
  assignment_id uuid references public.course_assignments(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  content text, -- Link or text submission
  status text check (status in ('pending', 'graded')) default 'pending',
  grade integer,
  feedback text,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. RLS POLICIES

-- Questions
alter table public.questions enable row level security;

create policy "Questions viewable by everyone" on public.questions for select using (true);
create policy "Students can insert questions" on public.questions for insert with check (auth.uid() = student_id);
create policy "Teachers can update questions (add answers)" on public.questions for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin'))
);

-- Course Assignments
alter table public.course_assignments enable row level security;

create policy "Course assignments viewable by everyone" on public.course_assignments for select using (true);
create policy "Teachers can insert/update assignments" on public.course_assignments for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin'))
);

-- Assignment Submissions
alter table public.assignment_submissions enable row level security;

create policy "Teachers see all submissions" on public.assignment_submissions for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin'))
);
create policy "Students see own submissions" on public.assignment_submissions for select using (auth.uid() = student_id);
create policy "Students can insert submissions" on public.assignment_submissions for insert with check (auth.uid() = student_id);
create policy "Teachers can update submissions (grade)" on public.assignment_submissions for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin'))
);

-- 5. REALTIME
alter publication supabase_realtime add table public.questions;
alter publication supabase_realtime add table public.assignment_submissions;
