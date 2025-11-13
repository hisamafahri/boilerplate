-- ============================================================================
-- UUID v7 Functions
-- See the UUID Version 7 specification at
-- https://www.rfc-editor.org/rfc/rfc9562#name-uuid-version-7
-- ============================================================================

CREATE OR REPLACE FUNCTION public.uuidv7(timestamptz DEFAULT clock_timestamp()) RETURNS uuid
AS $$
  select encode(
    set_bit(
      set_bit(
        overlay(uuid_send(gen_random_uuid()) placing
	  substring(int8send((extract(epoch from $1)*1000)::bigint) from 3)
	  from 1 for 6),
	52, 1),
      53, 1), 'hex')::uuid;
$$ LANGUAGE sql volatile parallel safe;

COMMENT ON FUNCTION public.uuidv7(timestamptz) IS
'Generate a uuid-v7 value with a 48-bit timestamp (millisecond precision) and 74 bits of randomness';


CREATE OR REPLACE FUNCTION public.uuidv7_sub_ms(timestamptz DEFAULT clock_timestamp()) RETURNS uuid
AS $$
 select encode(
   substring(int8send(floor(t_ms)::int8) from 3) ||
   int2send((7<<12)::int2 | ((t_ms-floor(t_ms))*4096)::int2) ||
   substring(uuid_send(gen_random_uuid()) from 9 for 8)
  , 'hex')::uuid
  from (select extract(epoch from $1)*1000 as t_ms) s
$$ LANGUAGE sql volatile parallel safe;

COMMENT ON FUNCTION public.uuidv7_sub_ms(timestamptz) IS
'Generate a uuid-v7 value with a 60-bit timestamp (sub-millisecond precision) and 62 bits of randomness';


CREATE OR REPLACE FUNCTION public.uuidv7_extract_timestamp(uuid) RETURNS timestamptz
AS $$
 select to_timestamp(
   right(substring(uuid_send($1) from 1 for 6)::text, -1)::bit(48)::int8
    /1000.0);
$$ LANGUAGE sql immutable strict parallel safe;

COMMENT ON FUNCTION public.uuidv7_extract_timestamp(uuid) IS
'Return the timestamp stored in the first 48 bits of the UUID v7 value';


CREATE OR REPLACE FUNCTION public.uuidv7_boundary(timestamptz) RETURNS uuid
AS $$
  select encode(
    overlay('\x00000000000070008000000000000000'::bytea
      placing substring(int8send(floor(extract(epoch from $1) * 1000)::bigint) from 3)
        from 1 for 6),
    'hex')::uuid;
$$ LANGUAGE sql stable strict parallel safe;

COMMENT ON FUNCTION public.uuidv7_boundary(timestamptz) IS
'Generate a non-random uuidv7 with the given timestamp (first 48 bits) and all random bits to 0. As the smallest possible uuidv7 for that timestamp, it may be used as a boundary for partitions.';

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.uuidv7(timestamptz) TO PUBLIC;
