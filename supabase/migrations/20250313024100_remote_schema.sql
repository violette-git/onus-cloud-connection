create table "public"."schema_migrations" (
    "version" character varying(255) not null,
    "applied_at" timestamp without time zone default CURRENT_TIMESTAMP
);


CREATE UNIQUE INDEX schema_migrations_pkey ON public.schema_migrations USING btree (version);

alter table "public"."schema_migrations" add constraint "schema_migrations_pkey" PRIMARY KEY using index "schema_migrations_pkey";

grant delete on table "public"."schema_migrations" to "anon";

grant insert on table "public"."schema_migrations" to "anon";

grant references on table "public"."schema_migrations" to "anon";

grant select on table "public"."schema_migrations" to "anon";

grant trigger on table "public"."schema_migrations" to "anon";

grant truncate on table "public"."schema_migrations" to "anon";

grant update on table "public"."schema_migrations" to "anon";

grant delete on table "public"."schema_migrations" to "authenticated";

grant insert on table "public"."schema_migrations" to "authenticated";

grant references on table "public"."schema_migrations" to "authenticated";

grant select on table "public"."schema_migrations" to "authenticated";

grant trigger on table "public"."schema_migrations" to "authenticated";

grant truncate on table "public"."schema_migrations" to "authenticated";

grant update on table "public"."schema_migrations" to "authenticated";

grant delete on table "public"."schema_migrations" to "service_role";

grant insert on table "public"."schema_migrations" to "service_role";

grant references on table "public"."schema_migrations" to "service_role";

grant select on table "public"."schema_migrations" to "service_role";

grant trigger on table "public"."schema_migrations" to "service_role";

grant truncate on table "public"."schema_migrations" to "service_role";

grant update on table "public"."schema_migrations" to "service_role";


