/********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.parameter.utils;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.uml2.uml.ParameterDirectionKind;

import com.borkdominik.big.glsp.server.features.property_palette.model.ElementChoicePropertyItem;

public class ParameterDirectionKindUtils {
   public static List<ElementChoicePropertyItem.Choice> asChoices() {
      return ParameterDirectionKind.VALUES.stream()
         .map(v -> ElementChoicePropertyItem.Choice.builder().label(v.getLiteral()).value(v.getLiteral()).build())
         .collect(Collectors.toList());
   }
}
