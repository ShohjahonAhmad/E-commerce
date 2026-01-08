-- Backfill missing user_roles rows for existing users (created before the trigger existed)
insert into public.user_roles (user_id, role)
select
  p.id as user_id,
  case
    when p.role in ('seller','buyer') then p.role::public.app_role
    else 'buyer'::public.app_role
  end as role
from public.profiles p
where not exists (
  select 1 from public.user_roles ur where ur.user_id = p.id
);

-- Harden role assignment so users cannot self-assign privileged roles like 'admin'
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.email),
    case
      when (new.raw_user_meta_data ->> 'role') in ('seller','buyer') then (new.raw_user_meta_data ->> 'role')
      else 'buyer'
    end
  );
  return new;
end;
$$;

create or replace function public.assign_user_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role)
  values (
    new.id,
    case
      when new.role in ('seller','buyer') then new.role::public.app_role
      else 'buyer'::public.app_role
    end
  )
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;