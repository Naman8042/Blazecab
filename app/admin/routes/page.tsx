"use client"
import React from "react";
import { Tabs , TabsList,TabsTrigger} from "@/components/ui/tabs";
import { useState } from "react";
import OnewayRoute from '@/app/_components/OnewayRoute'
import RoundTrip from '@/app/_components/TwowayRoute'
import LocalRoute from '@/app/_components/LocalRoute'


const Routes = () => {
  const [routeType, setRouteType] = useState<
    "oneway" | "roundtrip" | "localtrip"
  >("oneway");
  return (
    <div className="p-4 h-full w-full">
      <Tabs
        defaultValue="oneway"
        className=" w-full flex   items-center sm:items-start"
        onValueChange={(val) =>
          setRouteType(val as "oneway" | "roundtrip" | "localtrip")
        }
      >
        <TabsList className="mb-4">
          <TabsTrigger value="oneway">One Way</TabsTrigger>
          <TabsTrigger value="roundtrip">Round Trip</TabsTrigger>
          <TabsTrigger value="localtrip">Local Trip</TabsTrigger>
        </TabsList>
      </Tabs>
      {routeType === "oneway" && <OnewayRoute />}
      {routeType === "roundtrip" && <RoundTrip />}
      {routeType === "localtrip" && <LocalRoute />}
    </div>
  );
};

export default Routes;
