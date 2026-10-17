"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "../ui/toast";
import { useRouter } from "next/navigation";
import { useRegister } from "@/hooks/auth.hook";
import { Eye, EyeOffIcon } from "lucide-react";
import { registerSchema } from "@/validation/auth.validation";

export default function RegisterForm() {
  const [showPassword, setPassword] = useState(false);
  const router = useRouter();

  const { mutate: register, isPending: registerPedding } = useRegister();

  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: ({ value }) => {
      // console.log(data);
      const registerData = {
        name: value.name,
        phone: value.phone,
        email: value.email,
        password: value.password,
      };
      register(registerData, {
        onSuccess: (res) => {
          toast.add({
            title: "successfully login",
            description: "Welcome back",
            type: "success",
          });
          // console.log(res);
          router.push("/");
        },
        onError: (err) => {
          toast.add({
            title: "Authorization failure",
            description: err.message || "something went wronge",
            type: "error",
          });
          console.log(err);
        },
      });
    },
  });

  return (
    <form
      className=" space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <h2 className="text-2xl font-semibold">Login</h2>

      <FieldGroup>
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  autoComplete="off"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="phone">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Phone number</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  autoComplete="off"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  autoComplete="off"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <div className=" relative">
                  <Input
                    id={field.name}
                    type={showPassword ? "text" : "password"}
                    name={field.name}
                    autoComplete="off"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <button
                    className=" absolute right-3 top-1/2 -translate-y-1/2"
                    type="button"
                    onClick={() => setPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <Eye size={20} />
                    ) : (
                      <EyeOffIcon size={20} />
                    )}
                  </button>
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="confirmPassword">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                <div className=" relative">
                  <Input
                    id={field.name}
                    type={showPassword ? "text" : "password"}
                    name={field.name}
                    autoComplete="off"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <button
                    className=" absolute right-3 top-1/2 -translate-y-1/2"
                    type="button"
                    onClick={() => setPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <Eye size={20} />
                    ) : (
                      <EyeOffIcon size={20} />
                    )}
                  </button>
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <Button type="submit" className="w-full">
        Register
      </Button>
    </form>
  );
}
