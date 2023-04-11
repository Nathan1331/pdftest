import Certificate from './Certificate';
import Certificate2 from './Certificate2';

function App() {
  const user = {
    name: 'Name Last Name',
    level: 'Lorem Ipsum',
    date: "On Feb 27th 2023",
    score: '80'
  };
  return (
    <div>
      <Certificate user={user} />
    </div>
  );
}

export default App;
