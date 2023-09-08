import json, urllib.request,csv
import re
import mysql.connector

cnt = mysql.connector.connect(
  host="localhost",
  user="root",
  password="sharon616",
  database="taipei"
)
cur = cnt.cursor(dictionary=True,buffered=True)



# cur.execute("SELECT *  FROM Attractions")
# json to csv
f = open('C:/Users/sharon/Desktop/coding/wehelp/taipei-day-trip/taipei-day-trip/data/taipei-attractions.json',"r",encoding="utf-8")

data = json.load(f)
data = data["result"]["results"]
# print(data[0]["_id"])

for i in range(len(data)):
  print(i)
  
  id = data[i]["_id"]
  name = data[i]["name"]
  category = data[i]["CAT"]
  description = data[i]["description"]
  address = data[i]["address"]
  transport = data[i]["direction"]
  mrt = data[i]["MRT"]
  lat = data[i]["latitude"]
  lng = data[i]["longitude"]
  file=data[i]["file"]
  # images = "https"+images.split('https')[1]
    
  
  urls = re.findall(r'https?://[^\s"\'()]+\.jpg|https?://[^\s"\'()]+\.png', file,flags=0)
  urls= ''.join(urls)
  
  urls = urls.split('https')[1:]
  # print(urls)
  images=[]
  for url in urls:
    url = 'https'+ url
    print(url)
    images.append(url)
  print(images)
  images = ','.join(images)
  print(type(images))

  print(mrt)
  if mrt == None:
    mrt = "無資料"
  data_ = (id,name,category,description,address,transport,mrt,lat,lng,images)
  add_data = ("INSERT INTO Attraction(id,name,category,description,address,transport,mrt,lat,lng,images)VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);")
  cur.execute(add_data,data_)
  cnt.commit()

