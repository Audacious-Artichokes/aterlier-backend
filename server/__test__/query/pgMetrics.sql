-- scripts/clock_timestamp_function.sql

CREATE OR REPLACE FUNCTION bench(query TEXT, iterations INTEGER = 100, endpoint TEXT='test', comment TEXT=NULL)
RETURNS TABLE(avg FLOAT, min FLOAT, q1 FLOAT, median FLOAT, q3 FLOAT, p95 FLOAT, max FLOAT) AS $$
DECLARE
  _start TIMESTAMPTZ;
  _end TIMESTAMPTZ;
  _delta DOUBLE PRECISION;
BEGIN
  CREATE TEMP TABLE IF NOT EXISTS _bench_results (
      elapsed DOUBLE PRECISION
  );

  -- Warm the cache
  FOR i IN 1..5 LOOP
    EXECUTE query;
  END LOOP;

  -- Run test and collect elapsed time into _bench_results table
  FOR i IN 1..iterations LOOP
    _start = clock_timestamp();
    EXECUTE query;
    _end = clock_timestamp();
    _delta = 1000 * ( extract(epoch from _end) - extract(epoch from _start) );
    INSERT INTO _bench_results VALUES (_delta);
  END LOOP;

  RETURN QUERY SELECT
    avg(elapsed),
    min(elapsed),
    percentile_cont(0.25) WITHIN GROUP (ORDER BY elapsed),
    percentile_cont(0.5) WITHIN GROUP (ORDER BY elapsed),
    percentile_cont(0.75) WITHIN GROUP (ORDER BY elapsed),
    percentile_cont(0.95) WITHIN GROUP (ORDER BY elapsed),
    max(elapsed)
    FROM _bench_results;

  CREATE TABLE IF NOT EXISTS metrics (
      run_id serial PRIMARY KEY,
      date timestamp,
      category VARCHAR(100),
      avg decimal,
      min decimal,
      q1 decimal,
      median decimal,
      q3 decimal,
      p95 decimal,
      max decimal,
      comments VARCHAR(200000)
  );

  INSERT INTO metrics
    (category, date, avg, min, q1, median, q3, p95, max, comments)
  SELECT
    endpoint,
    current_timestamp,
    avg(elapsed),
    min(elapsed),
    percentile_cont(0.25) WITHIN GROUP (ORDER BY elapsed),
    percentile_cont(0.5) WITHIN GROUP (ORDER BY elapsed),
    percentile_cont(0.75) WITHIN GROUP (ORDER BY elapsed),
    percentile_cont(0.95) WITHIN GROUP (ORDER BY elapsed),
    max(elapsed),
    comment
    FROM _bench_results;

  DROP TABLE IF EXISTS _bench_results;

END
$$
LANGUAGE plpgsql;