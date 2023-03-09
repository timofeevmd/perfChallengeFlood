# perfChallengeFlood

environment:
docker
jmeter

Step to perform:
1.On terminal:
   1. docker-compose -f monitoring.yml up -d

On Grafana
2. Connect to influxdb
   1. url: http://influxdb:8086
   2. database: loadTestingDB
   3. Import new dashboard:
      1. upload apache-jmeter-dashboard-by-ubikloadpack_rev.json

3. On terminal
   1. Start JMeter script
      1. /path/to/jmeter -n -t /path/to/perfChallengeFlood/testScript.jmx -Jtarget_http_protocol=https -Jtarget_host=challenge.flood.io -Jtarget_port=443 -Jpath_to_aggregate_report=/path/to/perfChallengeFlood/logs/aggregateReport.csv -Jcount_of_users=5 -Jramp_up=10 -Jduration=60 -Jdeviation=50 -Joffset=1200  -l /path/to/perfChallengeFlood/logs/csvReport/testScript.csv -e -o /path/to/perfChallengeFlood/logs/htmlReport/