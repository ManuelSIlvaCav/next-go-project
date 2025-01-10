import CreateBusinessForm from "./form";

export default function CreatePage() {
  return (
    <div>
      <h1>Create Business</h1>

      <div className="flex flex-col justify-center items-center">
        <CreateBusinessForm />
      </div>
    </div>
  );
}
