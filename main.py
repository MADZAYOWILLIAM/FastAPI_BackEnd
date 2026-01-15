from fastapi import FastAPI


app=FastAPI()


@app.get('/')
def index():
    return {'data':{
        'name':"William"
    }
    }



@app.get('/about')
def ablut():
    return {'data':{'page':'About Page'}}