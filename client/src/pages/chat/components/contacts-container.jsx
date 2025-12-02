import React from "react";

const ContactsContainer = () => {
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] w-full bg-zinc-900 border-r-2 border-zinc-700">
      <Logo />
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Особисті чати" />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Групові чати" />
        </div>
      </div>
    </div>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div
      id="logo"
      className="flex gap-5 text-2xl roboto-condensed-700 text-purple-700 p-4"
    >
      <img src="/logo.png" alt="" className="w-8 h-8" />
      <p>QChat</p>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-gray-400/90 pl-10 font-light text-sm">
      {text}
    </h6>
  );
};
