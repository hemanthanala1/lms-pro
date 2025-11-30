
-- QUIZZES (Created by teachers or AI)
create table public.quizzes (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade, -- Optional: link to specific lesson
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- QUIZ QUESTIONS
create table public.quiz_questions (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade,
  question_text text not null,
  options jsonb not null, -- Array of strings: ["Option A", "Option B", ...]
  correct_answer text not null, -- The correct option string or index
  explanation text, -- Optional explanation for the answer
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- QUIZ SUBMISSIONS (Student attempts)
create table public.quiz_submissions (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  score integer not null, -- e.g., percentage or raw score
  answers jsonb not null, -- Store student's answers: { "question_id": "selected_option" }
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES

-- Quizzes
alter table public.quizzes enable row level security;
create policy "Quizzes viewable by everyone" on public.quizzes for select using (true);
create policy "Teachers can insert/update quizzes" on public.quizzes for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin'))
);

-- Quiz Questions
alter table public.quiz_questions enable row level security;
create policy "Quiz questions viewable by everyone" on public.quiz_questions for select using (true);
create policy "Teachers can insert/update quiz questions" on public.quiz_questions for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin'))
);

-- Quiz Submissions
alter table public.quiz_submissions enable row level security;
create policy "Teachers see all quiz submissions" on public.quiz_submissions for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher', 'admin'))
);
create policy "Students see own quiz submissions" on public.quiz_submissions for select using (auth.uid() = student_id);
create policy "Students can insert quiz submissions" on public.quiz_submissions for insert with check (auth.uid() = student_id);
