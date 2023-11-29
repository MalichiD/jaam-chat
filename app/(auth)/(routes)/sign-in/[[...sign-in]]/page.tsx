import { SignIn } from "@clerk/nextjs";
import { dark } from '@clerk/themes';

export default function Page() {
  return (
    <div className="w-full h-full bg-[url('https://utfs.io/f/05bfc158-a6ee-45d0-bf9c-4f82bcd53ab8-oj9gta.jpg')] bg-cover bg-no-repeat flex justify-center items-center">
      <div className="h-auto w-auto">
        <SignIn appearance={
          {
                    baseTheme: dark,
                    layout: {
                      socialButtonsVariant: "iconButton",
                    }
                  
                  }
        } />
      </div>
    </div>
    );
}