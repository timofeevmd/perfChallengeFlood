# perfChallengeFlood

Start JMeter script

/path/to/jmeter -n -t /path/to/perfChallengeFlood/testScript.jmx -Jtarget_http_protocol=https -Jtarget_host=challenge.flood.io -Jtarget_port=443 -Jpath_to_aggregate_report=/path/to/perfChallengeFlood/logs/aggregateReport.jtl -Jcount_of_users=5 -Jramp_up=10 -Jduration=60 -Jdeviation=50 -Joffset=600 -l /path/to/perfChallengeFlood/logs/csvReport/testScript.csv -e -o /path/to/perfChallengeFlood/logs/htmlReport/

/path/to/jmeter -n -t /path/to/perfChallengeFlood/testScript_0.jmx -l /path/to/perfChallengeFlood/logs/csvReport/testScript.csv -e -o /path/to/perfChallengeFlood/logs/htmlReport/