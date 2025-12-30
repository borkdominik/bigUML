/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import "reflect-metadata";

export function root(_target: any, _propertyKey?: any) {}
export function crossReference(_target: any, _propertyKey?: any) {}
export function path(_target: any, _propertyKey?: any) {}
export function noBounds(_target: any, _propertyKey?: any) {}
export function withDefaults(_target: any, _propertyKey?: any) {}
export function astType(value: any): ClassDecorator {
  return (constructor: Function) => {
    Reflect.defineMetadata("astType", value, constructor);
    const existing = (constructor as any).__customDecorators || [];
    existing.push(`astType:${value}`);
    (constructor as any).__customDecorators = existing;
  };
}
export function skipPropertyPP(_target: any, _propertyKey?: any) {}
export function dynamicProperty(value: any): PropertyDecorator {
  return ((constructor: Function) => {
    Reflect.defineMetadata("dynamicProperty", value, constructor);
    const existing = (constructor as any).__customDecorators || [];
    existing.push(`dynamicProperty:${value}`);
    (constructor as any).__customDecorators = existing;
  }) as any;
}
