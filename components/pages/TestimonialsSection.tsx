
export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      quote: "Our experience with their AI solutions exceeded our expectations. Their team was professional, knowledgeable, and highly responsive.",
      name: "Jane Doe",
      title: "CEO, Tech Innovators",
      image: "/images/avatars/jane-doe.png", // Optional avatar image path
    },
    {
      id: 2,
      quote: "The collaboration with their AI Studio on our blockchain project was seamless. Their expertise in smart contracts and DApps is top-notch. Highly recommended!",
      name: "John Smith",
      title: "CTO, Blockchain Solutions",
      image: "/images/avatars/john-smith.png", // Optional avatar image path
    },
    {
      id: 3,
      quote: "The insights we gained from their predictive analytics service have been invaluable to our business strategy. A truly fantastic partner.",
      name: "Alice Johnson",
      title: "COO, Global Corp",
      image: "/images/avatars/alice-johnson.png", // Optional avatar image path
    },
  ];

  return (
    <section className="w-full py-16"> {/* Section padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">What Our Clients Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
              {/* Optional Avatar */}
              {/* {testimonial.image && (
                <div className="flex justify-center mb-4">
                  <Image
                    src={testimonial.image}
                    alt={`Avatar of ${testimonial.name}`}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                </div>
              )} */}
              <blockquote className="italic mb-4 flex-grow">
                "{testimonial.quote}"
              </blockquote>
              <footer className="text-right">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm">{testimonial.title}</p>
              </footer>
            </div>
          ))}
        </div>
        <p>He said, &quot;Hello!&quot;</p>
        <p>Jane said, &quot;This is great!&quot;</p>
      </div>
    </section>
  );
}