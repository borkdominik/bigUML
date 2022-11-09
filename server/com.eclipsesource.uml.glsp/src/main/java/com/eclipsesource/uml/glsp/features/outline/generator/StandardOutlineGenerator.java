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

import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.features.outline.model.OutlineTreeNode;
import com.google.inject.Inject;

public class StandardOutlineGenerator implements DefaultDiagramOutlineGenerator {

   @Inject
   protected UmlModelState modelState;

   @Override
   public List<OutlineTreeNode> generate() {
      var model = modelState.getSemanticModel();

      var outlineTreeNodes = model.eContents().stream().filter(elem -> modelState.hasNotation(elem))
         .filter(elem -> elem instanceof Element)
         .map(elem -> (Element) elem)
         .map(child -> map(child))
         .collect(Collectors.toList());

      return outlineTreeNodes;
   }

   protected OutlineTreeNode map(final Element element) {
      var label = labelOf(element);
      var children = childrenOf(element);
      var icon = iconOf(element);

      return new OutlineTreeNode(label, EcoreUtil.getURI(element).fragment(), children, icon);
   }

   protected String labelOf(final Element element) {
      if (element instanceof NamedElement) {
         return ((NamedElement) element).getName();
      }
      return EcoreUtil.getID(element);
   }

   protected String iconOf(final Element element) {
      return "class";
   }

   protected List<OutlineTreeNode> childrenOf(final Element element) {
      if (element.getOwnedElements().isEmpty()) {
         return List.of();
      }

      return element.getOwnedElements().stream()
         .map(elem -> map(elem))
         .collect(Collectors.toList());
   }
}
