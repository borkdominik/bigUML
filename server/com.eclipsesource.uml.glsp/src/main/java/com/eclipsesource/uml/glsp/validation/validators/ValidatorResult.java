/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.validation.validators;

public class ValidatorResult {
   private final Status status;
   private final String label;
   private final String description;
   private final String elementId;

   public static ValidatorResult Success(final String elementId) {
      return new ValidatorResult(Status.SUCCESS, elementId, null, null);
   }

   public ValidatorResult(final Status status, final String elementId, final String label, final String description) {
      this.status = status;
      this.elementId = elementId;
      this.label = label;
      this.description = description;
   }

   public Status getStatus() { return status; }

   public String getLabel() { return label; }

   public String getDescription() { return description; }

   public String getElementId() { return elementId; }

   public enum Status {
      SUCCESS,
      INFO,
      WARNING,
      ERROR
   }
}
