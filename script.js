:root {
  --green: #1A6B3B;
  --light-green: #2E8B57;
  --yellow: #FFD700;
  --brown: #8B5E3C;
  --white: #FFFFFF;
  --gray: #F5F5F5;
  --dark: #333333;
}

body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background-color: var(--gray);
  color: var(--dark);
}

.loading-screen {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: var(--white);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo-container {
  margin-bottom: 20px;
}

.logo-circle {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, var(--green), var(--light-green));
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--white);
  font-size: 32px;
  font-weight: bold;
}

.loading-text {
  font-size: 18px;
  color: var(--green);
  font-weight: bold;
}

.header {
  background: var(--green);
  color: var(--white);
  padding: 20px;
  text-align: center;
}

.info-panels {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  justify-content: center;
}

.info-panel {
  background: var(--white);
  border: 1px solid var(--gray);
  border-radius: 8px;
  padding: 15px;
  width: 300px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.info-panel h2 {
  color: var(--green);
  font-size: 18px;
  margin-bottom: 10px;
}

.info-panel ul {
  list-style: none;
  padding: 0;
}

.info-panel li {
  margin-bottom: 8px;
  font-size: 14px;
}

.menu-section {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.menu-group {
  background: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  padding: 15px;
}

.menu-group h3 {
  color: var(--light-green);
  font-size: 16px;
  margin-bottom: 10px;
}

.menu-group ul {
  list-style: none;
  padding: 0;
}

.menu-group li
