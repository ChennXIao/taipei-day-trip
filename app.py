from flask import *
import mysql.connector 
import requests
from mysql.connector import pooling
from flask import config


db_config = {
    "host": "localhost",
    "user": "root",
	"password": "sharon616",
	"database": "taipei",
	"port": 3306,

}

# cnt = mysql.connector.connect(
#   host="localhost",
#   user="root",
#   password="sharon616",
#   database="taipei",
#   charset="utf8"
# )
# cur = cnt.cursor(dictionary=True,buffered=True)



app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['JSONIFY_MIMETYPE'] = "application/json;charset=utf-8"

# Pages
@app.route("/")
def index():
	cnt = mysql.connector.connect(**db_config)
	cur = cnt.cursor(dictionary=True,buffered=True)
	api = "Select * from Attraction where id =2;"
	print(api)
	cur.execute(api)
	result = cur.fetchall()
	print(result)
	return render_template("index.html")

@app.route("/api/attractions")
def api_attractions():


	message = request.args.get("key", "")
	nextPage = int(request.args.get("page", ""))+1
	print(type(nextPage))
	row = (nextPage-1)*12
	print(row)
	
	cnt = mysql.connector.connect(**db_config)
	cur = cnt.cursor(dictionary=True,buffered=True)
	api_attractions = "SELECT * FROM attraction WHERE name LIKE %s or mrt = %s LIMIT 12 OFFSET %s;"
	print(api_attractions)
	cur.execute(api_attractions,("%"+message+"%",message,row))
	result = cur.fetchall()
	print(result)
	img=[]
	if result:
		response= {"nextPage":nextPage,"data":[]}
		for i in range(len(result)):
			response["data"].append(result[i])
			# img.append(result[i]["images"])
			urls = result[i]["images"].split(',')
			result[i]["images"] = urls

		response = Response(
				response=json.dumps(response, ensure_ascii=False, indent=2),
				mimetype="application/json"
    )
	else:
			
		response= {"error":True,"message":"沒有此景點"}
		response = Response(
				response=json.dumps(response, ensure_ascii=False, indent=2),
				mimetype="application/json",status=500
		)

	cur.close()
	
 
	return response


@app.route("/api/attraction/<attractionId>")
def api_attractionId(attractionId):
	
	cnt = mysql.connector.connect(**db_config)
	cur = cnt.cursor(dictionary=True,buffered=True)
	api_attractionId = "SELECT * FROM attraction WHERE id = %s;"
	print(api_attractions)
	cur.execute(api_attractionId,(attractionId,))
	result = cur.fetchall()
	try:
		if result:
			response= {"data":[]}
			for i in range(len(result)):
				response["data"].append(result[i])
				urls = result[i]["images"].split(',')
				result[i]["images"] = urls				
			response = Response(
			response=json.dumps(response, ensure_ascii=False, indent=2),
			mimetype="application/json"
		)
		else:
				
			response= {"error":True,"message":"景點編號不正確"}
			response = Response(
					response=json.dumps(response, ensure_ascii=False, indent=2),
					mimetype="application/json",status=400
		)
	except:
			response= {"error":True,"message":"伺服器內部錯誤"}
			response = Response(
					response=json.dumps(response, ensure_ascii=False, indent=2),
					mimetype="application/json",status=500
			)


	cur.close()

	return response





@app.route("/api/mrts")
def attraction():

	cnt = mysql.connector.connect(**db_config)
	cur = cnt.cursor(dictionary=True,buffered=True)
	attraction_mrt  = "select mrt from attraction group by mrt order by count(mrt) desc limit 40;"
	cur.execute(attraction_mrt)
	mrt_result = cur.fetchall()
	print(mrt_result)
	
	if mrt_result:
		response= {"data":[]}
		for i in range(len(mrt_result)):
			response["data"].append(mrt_result[i]["mrt"])
		response = Response(
        response=json.dumps(response, ensure_ascii=False, indent=2),
        mimetype="application/json"
    )
			
	else:
			
		response= {"error":True,"message":"伺服器內部錯誤"}
		response = Response(
        response=json.dumps(response, ensure_ascii=False, indent=2),
        mimetype="application/json",status=500
    )

	cur.close()

	return response




# @app.route("/attraction/<id>")
# def attraction(id):
# 	return render_template("attraction.html")
# @app.route("/booking")
# def booking():
# 	return render_template("booking.html")
# @app.route("/thankyou")
# def thankyou():
# 	return render_template("thankyou.html")



if __name__ == "__main__":
 
 app.run(host="0.0.0.0", port=3000,debug=True)
