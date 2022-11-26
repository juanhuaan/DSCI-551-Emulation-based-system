import pandas as pd
import requests
import json



# load csv file as pandas
user_file = pd.read_csv("user.csv")
city_file = pd.read_csv("city.csv")
rate_file = pd.read_csv("rate.csv")
rest_file = pd.read_csv("rest.csv")

requests.delete(url="https://edfs-b732d-default-rtdb.firebaseio.com/population.json")
requests.delete(url="https://edfs-b732d-default-rtdb.firebaseio.com/review.json")



# upload user data to firebase
user0 = []
user1 = []
user2 = []
for index, row in user_file.iterrows():
    uid = row['uid']
    name = row['name']
    curr = {}
    curr['id'] = uid
    curr['name'] = name
    if ord(uid[0]) % 3 == 0:
        user0.append(curr)
    elif ord(uid[0]) % 3 == 1:
        user1.append(curr)
    elif ord(uid[0]) % 3 == 2:
        user2.append(curr)
    
requests.delete(url="https://edfs-b732d-default-rtdb.firebaseio.com/user.json")
requests.put(url="https://edfs-b732d-default-rtdb.firebaseio.com/user/user0.json", data=json.dumps(user0))
requests.put(url="https://edfs-b732d-default-rtdb.firebaseio.com/user/user1.json", data=json.dumps(user1))
requests.put(url="https://edfs-b732d-default-rtdb.firebaseio.com/user/user2.json", data=json.dumps(user2))
print("finish user")
# # upload city data to firebase
city0 = []
city1 = []
city2 = []

for index, row in city_file.iterrows():
    rank = row['Rank']
    city = row['City']
    pop = row['Population']

    curr = {}
    curr['rank'] = int(rank.strip().replace(',',''))
    curr['name'] = city
    curr['population'] = int(pop.strip().replace(',',''))

    if curr['rank']  % 3 == 0:
        city0.append(curr)
    elif curr['rank']  % 3 == 1:
        city1.append(curr)
    elif curr['rank']  % 3 == 2:
        city2.append(curr)
requests.delete(url="https://edfs-b732d-default-rtdb.firebaseio.com/city.json")
requests.put(url="https://edfs-b732d-default-rtdb.firebaseio.com/city/city0.json", data=json.dumps(city0))
requests.put(url="https://edfs-b732d-default-rtdb.firebaseio.com/city/city1.json", data=json.dumps(city1))
requests.put(url="https://edfs-b732d-default-rtdb.firebaseio.com/city/city2.json", data=json.dumps(city2))
print("finish city")

# # upload rate to firebase
rate0 = []
rate1 = []
rate2 = []

for index, row in rate_file.iterrows():
    id = row['id']
    rid = row['rid']
    rating = row['rating']
    uid = row['uid']
    
    curr = {}
    #curr['id'] = id
    curr['restId'] = rid
    curr['score'] = rating
    curr['userId'] = uid
    if rating % 3 == 0:
        rate0.append(curr)
    elif rating  % 3 == 1:
        rate1.append(curr)
    elif rating  % 3 == 2:
        rate2.append(curr)
requests.delete(url="https://edfs-b732d-default-rtdb.firebaseio.com/rate.json")
requests.put(url="https://edfs-b732d-default-rtdb.firebaseio.com/rate/rate0.json", data=json.dumps(rate0))
requests.put(url="https://edfs-b732d-default-rtdb.firebaseio.com/rate/rate1.json", data=json.dumps(rate1))
requests.put(url="https://edfs-b732d-default-rtdb.firebaseio.com/rate/rate2.json", data=json.dumps(rate2))
print("finish rate")


# upload rest to firebase
rest0 = []
rest1 = []
rest2 = []

for index, row in rest_file.iterrows():
    name = row['name']
    rate = row['rate']
    review_cnt = row['review_cnt']
    city = row['city']
    state = row['state']
    business_id = row['business_id']
    # latitude = row['latitude']
    # longitude = row['longitude']
    categories = row['categories']

    curr = {}
    curr['business_id'] = business_id
    curr['name'] = name
    curr['rate'] = int(rate)
    curr['review_cnt'] = int(review_cnt)
    curr['city'] = city
    curr['state'] = state
    
    # if latitude == None:
    #     curr['latitude'] = float(0)
    # else:
    #     curr['latitude'] = float(latitude)
    # if longitude == None:
    #     curr['longitude'] = float(0)
    # else:
    #     curr['longitude'] = float(longitude)
    curr['categories'] = categories
    if ord(business_id[0]) % 3 == 0:
        rest0.append(curr)
    elif ord(business_id[0]) % 3 == 1:
        rest1.append(curr)
    elif ord(business_id[0]) % 3 == 2:
        rest2.append(curr)
#print(json.dumps(rest0, indent=2))
requests.delete(url="https://edfs-b732d-default-rtdb.firebaseio.com/rest.json")
#print(json.dumps(rest0))
requests.put(url="https://edfs-b732d-default-rtdb.firebaseio.com/rest/rest0.json", data=json.dumps(rest0))

#print("finish rest0")

requests.put(url="https://edfs-b732d-default-rtdb.firebaseio.com/rest/rest1.json", data=json.dumps(rest0))
#print("finish rest1")
requests.put(url="https://edfs-b732d-default-rtdb.firebaseio.com/rest/rest2.json", data=json.dumps(rest2))
#print("finish rest2")



