from flask import *
import mysql.connector 
import requests
from mysql.connector import pooling
from flask import config
import jwt 
from datetime import datetime,timedelta

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "sharon616",
    "database": "taipei"
}
key = "secret"
cnt = mysql.connector.connect(**db_config)
cur = cnt.cursor(dictionary=True,buffered=True)


app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['JSONIFY_MIMETYPE'] = "application/json;charset=utf-8"

# Pages
@app.route("/", methods=["POST","GET"])
def index():

	return render_template("index.html")


@app.route("/api/user",methods=["POST"])
def api_user():
	try:
		cnt = mysql.connector.connect(**db_config)
		cur = cnt.cursor(dictionary=True,buffered=True)
		cur2 = cnt.cursor(dictionary=True,buffered=True)

		name = request.json.get('name')
		email = request.json.get('email')
		password = request.json.get('password')

		api_user = ("SELECT * FROM member WHERE email = %s;")

		cur.execute(api_user,(email,))
		api_user_checked = cur.fetchone()
		if api_user_checked:
			response = {"error": True,"message":"信箱已被註冊"}
			response = Response(
					response=json.dumps(response, ensure_ascii=False, indent=2),
					mimetype="application/json",status=400
			)
		else:
			data = (name,email,password)
			add_data = ("INSERT INTO member(name,email,password)VALUES(%s,%s,%s);")
			cur2.execute(add_data,data)
			cnt.commit()
			response = {"ok": True}
	except:	
		{"error": True,"message":"伺服器內部錯誤"}
		response = Response(
				response=json.dumps(response, ensure_ascii=False, indent=2),
				mimetype="application/json",status=500
		)

	print(response)

	return response

@app.route("/api/user/auth",methods=["PUT"])
def api_user_auth():
	try:
		cnt = mysql.connector.connect(**db_config)
		cur = cnt.cursor(dictionary=True,buffered=True)	
		email = request.json.get('email')
		password = request.json.get('password')
		api_user_auth = ("SELECT * FROM member WHERE email = %s and password = %s;")
		cur.execute(api_user_auth,(email,password,))
		api_user_checked = cur.fetchone()
		print(api_user_checked)
	
		if api_user_checked:
			playload = { "id": api_user_checked["id"],"name": api_user_checked["name"], "email": api_user_checked["email"], "password": api_user_checked["password"],"exp": datetime.utcnow() + timedelta(days=7)}
			print(playload)
			encoded = jwt.encode(playload, key, algorithm="HS256")
			response = {"token": encoded} 
		else:

			response = {"error": True,"message":"信箱或密碼錯誤"}
			response = Response(
					response=json.dumps(response, ensure_ascii=False, indent=2),
					mimetype="application/json",status=400
			)
	except:
		response = {"error": True,"message":"伺服器內部錯誤"}
		response = Response(
					response=json.dumps(response, ensure_ascii=False, indent=2),
					mimetype="application/json",status=500
			)

	print(response)
	return response



@app.route("/api/user/auth",methods=["GET"])
def api_user_auth_():
	try:
		auth_header = request.headers.get('Authorization')
		
		if 'Bearer ' in auth_header:
			token = auth_header.split('Bearer ')[1] 
		else:
			pass
		payload = jwt.decode(token, key, algorithms=["HS256"])

		id = payload.get('id')
		name = payload.get('name')
		email = payload.get('email')
		response = {"data":{
			"id":id,
			"name":name,
			"email":email,
		}}		
		response = Response(
				response=json.dumps(response, ensure_ascii=False, indent=2),
				mimetype="application/json")
		print(response,0)
	except jwt.exceptions.ExpiredSignatureError as e:
		print(e)
		response = {"error":"token has expired."}
		print(response)
	
	return response


@app.route("/api/attractions")
def api_attractions():

	message = request.args.get("keyword", "")
	nextPage = int(request.args.get("page", ""))+1
	row = (nextPage-1)*12
	
	cnt = mysql.connector.connect(**db_config)
	cur = cnt.cursor(dictionary=True,buffered=True)
	cur2 = cnt.cursor(dictionary=True,buffered=True)

	api_attractions = "SELECT * FROM attraction WHERE name LIKE %s or mrt = %s LIMIT 12 OFFSET %s;"

	cur.execute(api_attractions,("%"+message+"%",message,row))
	cur2.execute(api_attractions,("%"+message+"%",message,nextPage*12))
	result2 = cur2.fetchall()
	
	if result2:
		nextPage = nextPage
	else:
		nextPage = None

	result = cur.fetchall()
	
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
			response= {"data":result[0]}
			
			urls = result[0]["images"].split(',')
			result[0]["images"] = urls				
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
def mrt():

	cnt = mysql.connector.connect(**db_config)
	cur = cnt.cursor(dictionary=True,buffered=True)
	attraction_mrt  = "select mrt from attraction group by mrt order by count(mrt) desc limit 40;"
	cur.execute(attraction_mrt)
	mrt_result = cur.fetchall()
	# print(mrt_result)
	
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

@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
# @app.route("/booking")
# def booking():
# 	return render_template("booking.html")
# @app.route("/thankyou")
# def thankyou():
# 	return render_template("thankyou.html")


if __name__ == "__main__":
 
 app.run(host="0.0.0.0", port=3000,debug=True)
 app.run(debug=True)
