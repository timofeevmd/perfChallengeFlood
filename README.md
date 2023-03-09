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
      1. /path/to/jmeter -n -t /path/to/perfChallengeFlood/testScript.jmx -JcounOfUsers=5 -JrumpUp=10 -Jduration=60 -Jdeviation=50 -Joffset=1500 -JtargetHttpProtocol=https -JtargetHost=challenge.flood.io -JtargetPort=443 -JpathToAggregateReport=/path/to/perfChallengeFlood/logs/aggregateReport.csv -l /path/to/perfChallengeFlood/logs/csvReport/testScript.csv -e -o /path/to/perfChallengeFlood/logs/htmlReport/