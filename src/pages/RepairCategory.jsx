import { Link, useParams } from "react-router-dom";
import "./RepairCategory.css";

const repairData = {
  electronics: {
    title: "Electronics repairs",
    description:
      "Find the right kind of repair for your everyday electronics.",
    items: [
      {
        title: "Phone repair",
        description: "Screen, battery, charging port and other phone repairs.",
        icon: "bi-phone",
      },
      {
        title: "Laptop repair",
        description:
          "Screen, keyboard, battery, charging and hardware repairs.",
        icon: "bi-laptop",
      },
      {
        title: "Tablet repair",
        description:
          "Display, battery, charging and hardware-related repairs.",
        icon: "bi-tablet",
      },
      {
        title: "Appliance repair",
        description:
          "Repair everyday electrical and household appliances.",
        icon: "bi-plug",
      },
    ],
  },

  bicycles: {
    title: "Bicycle repairs",
    description:
      "Keep your bicycle running smoothly with the right repair.",
    items: [
      {
        title: "Brake repair",
        description:
          "Brake adjustment, replacement and general brake issues.",
        icon: "bi-bicycle",
      },
      {
        title: "Tyre repair",
        description:
          "Punctures, tyre replacement and wheel-related problems.",
        icon: "bi-circle",
      },
      {
        title: "Chain repair",
        description:
          "Broken, loose or poorly shifting bicycle chains.",
        icon: "bi-link",
      },
      {
        title: "Gear repair",
        description:
          "Gear adjustment and shifting-related problems.",
        icon: "bi-gear",
      },
    ],
  },

  cameras: {
    title: "Camera repairs",
    description:
      "Give your camera and photography equipment another life.",
    items: [
      {
        title: "Lens repair",
        description:
          "Lens alignment, focusing and mechanical problems.",
        icon: "bi-camera",
      },
      {
        title: "Camera body repair",
        description:
          "Buttons, doors, controls and other body-related problems.",
        icon: "bi-camera2",
      },
      {
        title: "Battery & power",
        description:
          "Battery, charging and power-related problems.",
        icon: "bi-battery-half",
      },
      {
        title: "Film camera repair",
        description:
          "Mechanical and film transport problems.",
        icon: "bi-camera-reels",
      },
    ],
  },

  furniture: {
    title: "Furniture repairs",
    description:
      "Restore furniture instead of throwing it away.",
    items: [
      {
        title: "Woodwork",
        description:
          "Broken wood, joints, panels and structural repairs.",
        icon: "bi-hammer",
      },
      {
        title: "Furniture restoration",
        description:
          "Restore older furniture and bring it back to life.",
        icon: "bi-brush",
      },
      {
        title: "Fittings & hardware",
        description:
          "Handles, hinges, knobs and other furniture fittings.",
        icon: "bi-tools",
      },
      {
        title: "Door & cabinet repair",
        description:
          "Fix stuck, damaged or broken doors and cabinets.",
        icon: "bi-door-open",
      },
    ],
  },
};

export default function RepairCategory() {
  const { category } = useParams();

  const data = repairData[category];

  if (!data) {
    return (
      <main className="repair-category-page">
        <div className="container py-5">
          <h1>Repair category not found</h1>

          <Link to="/" className="repair-back-link">
            ← Back home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="repair-category-page">

      <section className="repair-category-hero">
        <div className="container">

          <Link to="/" className="repair-back-link">
            ← Back to home
          </Link>

          <div className="repair-category-eyebrow">
            RepairLoop
          </div>

          <h1>{data.title}</h1>

          <p>{data.description}</p>

        </div>
      </section>


      <section className="repair-types">
        <div className="container">

          <div className="repair-types-heading">
            <span>Choose a repair</span>

            <h2>
              What needs fixing?
            </h2>
          </div>


          <div className="row g-4">

            {data.items.map((item) => (
              <div
                className="col-md-6 col-lg-3"
                key={item.title}
              >
                <article className="repair-type-card">

                  <div className="repair-type-icon">
                    <i className={`bi ${item.icon}`} />
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                  <Link
                    to="/create-item"
                    className="repair-type-button"
                  >
                    Start this repair
                    <span>↗</span>
                  </Link>

                </article>
              </div>
            ))}

          </div>

        </div>
      </section>

    </main>
  );
}