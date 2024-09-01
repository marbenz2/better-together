create table public.trips (
    id uuid default uuid_generate_v4() primary key,
    image text,
    name text not null,
    ort text not null,
    plz text not null,
    land text not null,
    anreise_link text
);
-- Aktivieren der Zeilenebenen-Sicherheit
alter table public.trips enable row level security;