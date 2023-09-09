import hackathon from '../assets/images/hackathon.png';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to umi!</h1>
      <p>
        <img src={hackathon} style={{ width: '100vw' }} />
      </p>
      <h2>
        To get started, edit <code>pages/index.tsx</code> and save to reload.
      </h2>
    </div>
  );
}
