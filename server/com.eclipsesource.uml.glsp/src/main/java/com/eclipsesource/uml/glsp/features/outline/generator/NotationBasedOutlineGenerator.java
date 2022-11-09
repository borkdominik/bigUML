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
package com.eclipsesource.uml.glsp.features.outline.generator;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.glsp.features.outline.generator.StandardOutlineGenerator;
import com.eclipsesource.uml.glsp.features.outline.model.OutlineTreeNode;

public class NotationBasedOutlineGenerator extends StandardOutlineGenerator {

   @Override
   protected List<OutlineTreeNode> childrenOf(final Element element) {
      if (element.getOwnedElements().isEmpty()) {
         return List.of();
      }

      return element.getOwnedElements().stream()
         .filter(elem -> modelState.hasNotation(elem))
         .map(elem -> map(elem))
         .collect(Collectors.toList());
   }
}
