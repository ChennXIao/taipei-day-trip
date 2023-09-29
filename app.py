from flask import *
import mysql.connector 
import requests
from mysql.connector import pooling
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


def JWT():
	auth_header = request.headers.get('Authorization')
				
	if 'Bearer ' in auth_header:
		token = auth_header.split('Bearer ')[1] 
	else:
		pass
	payload = jwt.decode(token, key, algorithms=["HS256"])
	token_id = payload.get('id')
	return token_id


@app.route("/api/booking",methods=["POST","GET","DELETE"])
def api_booking():
	if request.method == 'POST':

		cnt = mysql.connector.connect(**db_config)
		cur = cnt.cursor(dictionary=True,buffered=True)
		try:
			token_id = JWT()
			orderId = request.json.get('attractionId')
			date = request.json.get('date').replace(" ","")
			time = request.json.get('time').replace(" ","")
			price = request.json.get('price').replace(" ","")

			order_data = (token_id,orderId,date,time,price)

			api_orderId = "insert into `order`(member_id,order_id,date,time,price)value(%s,%s,%s,%s,%s);"
			cur.execute(api_orderId,order_data)
			cnt.commit()

		
			if token_id:
				response= {"ok": True}			
				response = Response(
				response=json.dumps(response, ensure_ascii=False, indent=2),
				mimetype="application/json"
			)
			
			else:
				response= {"error":True,"message":"未登入系統，拒絕存取"}
				response = Response(
						response=json.dumps(response, ensure_ascii=False, indent=2),
						mimetype="application/json",status=403
			)
	
		except jwt.exceptions.ExpiredSignatureError:
			response= {"error":True,"message":"建立失敗，輸入不正確或其他原因"}
			response = Response(
						response=json.dumps(response, ensure_ascii=False, indent=2),
						mimetype="application/json",status=400
				)
		except Exception:
				response= {"error":True,"message":"伺服器內部錯誤"}
				response = Response(
						response=json.dumps(response, ensure_ascii=False, indent=2),
						mimetype="application/json",status=500
				)

		cur.close()
		return response
	
	if request.method == 'GET':
		cnt = mysql.connector.connect(**db_config)
		cur = cnt.cursor(dictionary=True,buffered=True)
		cur2 = cnt.cursor(dictionary=True,buffered=True)
		
		token_id = JWT()

		try:
			api_orderId = "select * from member inner join `order` on member.id=`order`.member_id where member.id = %s;"
			cur.execute(api_orderId,(token_id,))
			order_result = cur.fetchall()

			if order_result:

				get_attration = "SELECT * FROM attraction WHERE id = %s;"
				cur2.execute(get_attration,(order_result[len(order_result)-1]["order_id"],))
				attraction_result = cur2.fetchall()

				urls = attraction_result[0]["images"].split(',')
				attraction_result[0]["images"] = urls	
				
				response = {"data":{
									"attraction":{
										"id":attraction_result[0]["id"],
										"name":attraction_result[0]["name"],
										"address":attraction_result[0]["address"],
										"image":attraction_result[0]["images"][0]}},
									"date":order_result[0]["date"],
									"time":order_result[0]["time"],
									"price":order_result[0]["price"],
									}
			else:
				response= {"data":None}
				response = Response(
						response=json.dumps(response, ensure_ascii=False, indent=2),
						mimetype="application/json",status=200
					)

		except:
			response= {"error":True,"message":"伺服器內部錯誤"}
			response = Response(
			response=json.dumps(response, ensure_ascii=False, indent=2),
				mimetype="application/json",status=500
				)	
		return response
	
	if request.method == 'DELETE':
		cnt = mysql.connector.connect(**db_config)
		cur = cnt.cursor(dictionary=True,buffered=True)
		try:
			token_id = JWT()
			order_del = "DELETE FROM `order` WHERE member_id=%s;"
			cur.execute(order_del,(token_id,))
			print(cur)
			cnt.commit()

			response= {"ok": True}	
			response = Response(
				response=json.dumps(response, ensure_ascii=False, indent=2),
				mimetype="application/json",status=200
			)
		except:
			response= {"error":True,"message":"未登入系統，拒絕存取"}
			response = Response(
				response=json.dumps(response, ensure_ascii=False, indent=2),
				mimetype="application/json",status=403
			)
		return response





@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
# @app.route("/thankyou")
# def thankyou():
# 	return render_template("thankyou.html")



if __name__ == "__main__":
 
 app.run(host="0.0.0.0", port=3000,debug=True)
 app.run(debug=True)