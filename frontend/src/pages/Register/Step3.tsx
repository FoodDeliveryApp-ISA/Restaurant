import React from "react";
import { Form, Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { EnvironmentOutlined } from "@ant-design/icons";

const Step3: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Form.Item label="City" help={errors.city?.message}>
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              prefix={<EnvironmentOutlined />}
              placeholder="Enter your city"
            />
          )}
        />
      </Form.Item>
      <Form.Item label="State" help={errors.state?.message}>
        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Enter your state" />
          )}
        />
      </Form.Item>
      <Form.Item label="Zip Code" help={errors.zipCode?.message}>
        <Controller
          name="zipCode"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Enter your zip code" />
          )}
        />
      </Form.Item>
    </>
  );
};

export default Step3;
