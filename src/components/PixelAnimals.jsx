import "./PixelAnimals.css";

export default function PixelAnimals() {
  return (
    <div className="animals-layer" aria-hidden="true">
      {/* Running cat */}
      <div className="animal cat">
        <div className="cat-body" />
        <div className="cat-tail" />
      </div>

      {/* Hopping bunny */}
      <div className="animal bunny">
        <div className="bunny-body" />
        <div className="bunny-ear-l" />
        <div className="bunny-ear-r" />
      </div>

      {/* Flying bird 1 */}
      <div className="animal bird bird-1">
        <div className="bird-body" />
        <div className="bird-wing" />
      </div>

      {/* Flying bird 2 */}
      <div className="animal bird bird-2">
        <div className="bird-body" />
        <div className="bird-wing" />
      </div>

      {/* Little duck waddling */}
      <div className="animal duck">
        <div className="duck-body" />
        <div className="duck-beak" />
      </div>
    </div>
  );
}
