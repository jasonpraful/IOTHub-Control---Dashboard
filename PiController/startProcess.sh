if ps -ef | grep automated.py | grep -v grep > /dev/null
then
    echo "Running"
    pkill -f automated.py
    python3 automated.py
else
    echo "Stopped"
    python3 automated.py
fi
