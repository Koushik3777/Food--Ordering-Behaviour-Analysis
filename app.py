from flask import Flask, render_template

app = Flask(__name__)

# Route for Home page
@app.route('/')
def home():
    # Overview metrics related to food ordering dashboards
    metrics = {
        'total_orders': '142.8K',
        'avg_delivery_time': '28.4 min',
        'active_restaurants': '1,248',
        'top_cuisine': 'American & Italian',
        'avg_rating': '4.62'
    }
    return render_template("index.html", metrics=metrics, active_page='home')

# Route for Tableau Dashboard page
@app.route('/dashboard')
def dashboard():
    # URL for Tableau Dashboard: https://public.tableau.com/views/foodorderingdashboard/Dashboard1
    return render_template("dashboard.html", active_page='dashboard')

# Route for Tableau Story page
@app.route('/story')
def story():
    # URL for Tableau Story: https://public.tableau.com/views/foodorderingstory/Story1
    return render_template("story.html", active_page='story')

# Route for About page
@app.route('/about')
def about():
    return render_template("about.html", active_page='about')


# Route that shows both the Dashboard and the Story on one page
@app.route('/both')
def both():
    return render_template("both.html", active_page='both')

if __name__ == '__main__':
    app.run(debug=True)
