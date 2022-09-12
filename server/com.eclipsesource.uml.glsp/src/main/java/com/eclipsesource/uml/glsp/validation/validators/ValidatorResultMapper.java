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

import java.util.List;
import java.util.stream.Collectors;

import javax.naming.OperationNotSupportedException;

import org.apache.log4j.Logger;
import org.eclipse.glsp.server.features.directediting.ValidationStatus;
import org.eclipse.glsp.server.features.validation.Marker;
import org.eclipse.glsp.server.features.validation.MarkerKind;

public class ValidatorResultMapper {
   private static Logger LOGGER = Logger.getLogger(ValidatorResultMapper.class.getSimpleName());

   private ValidatorResultMapper() {

   }

   public static ValidationStatus toValidationResult(final ValidatorResult source) {
      switch (source.getStatus()) {
         case ERROR:
            return ValidationStatus.error(source.getDescription());
         case INFO:
            return ValidationStatus.ok(source.getDescription());
         case SUCCESS:
            return ValidationStatus.ok();
         case WARNING:
            return ValidationStatus.warning(source.getDescription());
         default:
            return ValidationStatus.ok();
      }
   }

   public static Marker toMarker(final ValidatorResult source) throws OperationNotSupportedException {
      return new Marker(
         source.getLabel(),
         source.getDescription(),
         source.getElementId(),
         toMarkerKind(source.getStatus()));
   }

   public static String toMarkerKind(final ValidatorResult.Status source) throws OperationNotSupportedException {
      switch (source) {
         case ERROR:
            return MarkerKind.ERROR;
         case WARNING:
            return MarkerKind.WARNING;
         case INFO:
            return MarkerKind.INFO;
         default:
            throw new OperationNotSupportedException("No mapping found for " + source.name());
      }
   }

   public static List<Marker> toMarkerList(final List<ValidatorResult> validations) {
      return validations.stream().map(r -> {
         try {
            return ValidatorResultMapper.toMarker(r);
         } catch (Exception e) {
            return null;
         }
      }).filter(m -> m != null).collect(Collectors.toUnmodifiableList());
   }
}
