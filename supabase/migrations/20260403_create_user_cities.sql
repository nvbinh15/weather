create table public.user_cities (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  city_id bigint not null,
  name text not null,
  country text not null default '',
  lat double precision not null,
  lon double precision not null,
  position int not null default 0,
  created_at timestamptz default now(),
  unique (user_id, city_id)
);

alter table public.user_cities enable row level security;

create policy "Users can view their own cities"
  on public.user_cities for select
  using (auth.uid() = user_id);

create policy "Users can insert their own cities"
  on public.user_cities for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own cities"
  on public.user_cities for delete
  using (auth.uid() = user_id);

create policy "Users can update their own cities"
  on public.user_cities for update
  using (auth.uid() = user_id);
