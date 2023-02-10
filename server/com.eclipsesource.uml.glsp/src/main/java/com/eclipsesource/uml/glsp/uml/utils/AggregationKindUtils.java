/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.utils;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.uml2.uml.AggregationKind;

import com.eclipsesource.uml.glsp.features.property_palette.model.ElementChoicePropertyItem;

public class AggregationKindUtils {
   public static List<ElementChoicePropertyItem.Choice> asChoices() {
      return AggregationKind.VALUES.stream()
         .map(v -> new ElementChoicePropertyItem.Choice(v.getLiteral(), v.getLiteral()))
         .collect(Collectors.toList());
   }
}
