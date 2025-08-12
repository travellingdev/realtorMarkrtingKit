-- Monitor kit generation failure rate and average latency over last 7 days
select
  date_trunc('day', created_at) as day,
  count(*) filter (where status = 'FAILED')::float / greatest(count(*),1) as failure_rate,
  avg(latency_ms) as avg_latency_ms
from kits
where created_at > now() - interval '7 days'
group by day
order by day;
