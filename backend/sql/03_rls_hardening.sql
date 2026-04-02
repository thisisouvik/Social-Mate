-- ===================================================================================
-- SUPABASE RLS HARDENING
-- Description: Enables RLS on Django-managed tables in public schema and adds
--              minimal owner-focused policies for app tables.
-- NOTE: Django uses DATABASE_URL directly, not PostgREST. These policies are for
--       Supabase API surface protection and advisor compliance.
-- ===================================================================================

-- Ensure auth hook function has a fixed search_path.
alter function public.handle_new_user() set search_path = public, pg_temp;

-- Enable RLS on Django and app tables in public schema.
alter table if exists public.django_migrations enable row level security;
alter table if exists public.django_content_type enable row level security;
alter table if exists public.auth_permission enable row level security;
alter table if exists public.auth_group enable row level security;
alter table if exists public.auth_group_permissions enable row level security;
alter table if exists public.users_user enable row level security;
alter table if exists public.users_user_groups enable row level security;
alter table if exists public.users_user_user_permissions enable row level security;
alter table if exists public.django_admin_log enable row level security;
alter table if exists public.follows_follow enable row level security;
alter table if exists public.posts_post enable row level security;
alter table if exists public.posts_like enable row level security;
alter table if exists public.posts_comment enable row level security;
alter table if exists public.posts_postimage enable row level security;
alter table if exists public.posts_share enable row level security;
alter table if exists public.notifications_notification enable row level security;

-- Idempotent policy cleanup for app tables.
drop policy if exists "users_select_own" on public.users_user;
drop policy if exists "users_update_own" on public.users_user;
drop policy if exists "posts_select_all" on public.posts_post;
drop policy if exists "posts_insert_own" on public.posts_post;
drop policy if exists "posts_update_own" on public.posts_post;
drop policy if exists "posts_delete_own" on public.posts_post;
drop policy if exists "comments_select_all" on public.posts_comment;
drop policy if exists "comments_insert_own" on public.posts_comment;
drop policy if exists "comments_update_own" on public.posts_comment;
drop policy if exists "comments_delete_own" on public.posts_comment;
drop policy if exists "likes_select_all" on public.posts_like;
drop policy if exists "likes_insert_own" on public.posts_like;
drop policy if exists "likes_delete_own" on public.posts_like;
drop policy if exists "follows_select_all" on public.follows_follow;
drop policy if exists "follows_insert_own" on public.follows_follow;
drop policy if exists "follows_delete_own" on public.follows_follow;
drop policy if exists "notifications_select_own" on public.notifications_notification;
drop policy if exists "notifications_update_own" on public.notifications_notification;

-- users_user: user can read and update only their own row.
create policy "users_select_own"
on public.users_user for select
to authenticated
using (id = auth.uid());

create policy "users_update_own"
on public.users_user for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- posts_post: authenticated users can read all posts and manage own posts.
create policy "posts_select_all"
on public.posts_post for select
to authenticated
using (true);

create policy "posts_insert_own"
on public.posts_post for insert
to authenticated
with check (author_id = auth.uid());

create policy "posts_update_own"
on public.posts_post for update
to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

create policy "posts_delete_own"
on public.posts_post for delete
to authenticated
using (author_id = auth.uid());

-- posts_comment: authenticated users can read all comments and manage own comments.
create policy "comments_select_all"
on public.posts_comment for select
to authenticated
using (true);

create policy "comments_insert_own"
on public.posts_comment for insert
to authenticated
with check (user_id = auth.uid());

create policy "comments_update_own"
on public.posts_comment for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "comments_delete_own"
on public.posts_comment for delete
to authenticated
using (user_id = auth.uid());

-- posts_like: authenticated users can read all likes, create/delete own likes.
create policy "likes_select_all"
on public.posts_like for select
to authenticated
using (true);

create policy "likes_insert_own"
on public.posts_like for insert
to authenticated
with check (user_id = auth.uid());

create policy "likes_delete_own"
on public.posts_like for delete
to authenticated
using (user_id = auth.uid());

-- follows_follow: authenticated users can read graph, create/delete own relations.
create policy "follows_select_all"
on public.follows_follow for select
to authenticated
using (true);

create policy "follows_insert_own"
on public.follows_follow for insert
to authenticated
with check (follower_id = auth.uid());

create policy "follows_delete_own"
on public.follows_follow for delete
to authenticated
using (follower_id = auth.uid());

-- notifications_notification: users can read/update only own notifications.
create policy "notifications_select_own"
on public.notifications_notification for select
to authenticated
using (recipient_id = auth.uid());

create policy "notifications_update_own"
on public.notifications_notification for update
to authenticated
using (recipient_id = auth.uid())
with check (recipient_id = auth.uid());
