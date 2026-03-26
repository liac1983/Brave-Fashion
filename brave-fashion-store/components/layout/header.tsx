import Logo from "./logo";
import MainNav from "./main-nav";
import CartButton from "./cart-button";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        
        <Logo />

        <MainNav />

        <CartButton />

      </div>
    </header>
  );
}

