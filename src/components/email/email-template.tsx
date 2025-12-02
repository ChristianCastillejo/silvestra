import React from "react";

interface EmailTemplateProps {
  readonly name: string;
  readonly email: string;
  readonly message: string;
}

export default function EmailTemplate({
  name,
  email,
  message,
}: EmailTemplateProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex">
        <span>Name:</span>
        <span>{name}</span>
      </div>
      <div className="flex">
        <span>Email:</span>
        <span>{email}</span>
      </div>
      <div className="flex">
        <span>Message:</span>
        <span>{message}</span>
      </div>
    </div>
  );
}
