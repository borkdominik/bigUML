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

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.features.outline.model.OutlineTreeNode;
import com.google.inject.Inject;

public abstract class BaseOutlineGenerator implements DiagramOutlineGenerator {

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected EMFIdGenerator idGenerator;

   @Override
   public List<OutlineTreeNode> generate() {
      var model = modelState.getSemanticModel();

      var outlineTreeNodes = model.eContents().stream().filter(elem -> modelState.hasNotation(elem))
         .filter(this::filter)
         .map(elem -> (Element) elem)
         .map(this::map)
         .collect(Collectors.toList());

      var root = new OutlineTreeNode("Model", modelState.getRoot().getId(), outlineTreeNodes, "model", true);
      return List.of(root);
   }

   protected boolean filter(final EObject eObject) {
      return eObject instanceof Element;
   }

   protected OutlineTreeNode map(final Element element) {
      var label = labelOf(element);
      var children = childrenOf(element);
      var icon = iconOf(element);

      return new OutlineTreeNode(label, EcoreUtil.getURI(element).fragment(), children, icon);
   }

   protected String labelOf(final Element element) {
      var prefix = element.getClass().getSimpleName().split("Impl")[0];
      var label = idGenerator.getOrCreateId(element);

      if (element instanceof NamedElement) {
         var namedElement = (NamedElement) element;
         var name = namedElement.getName();

         if (name != null) {
            label = name;
         }
      }

      return "[" + prefix + "] " + label;
   }

   protected String iconOf(final Element element) {
      return "element";
   }

   protected List<OutlineTreeNode> childrenOf(final Element element) {
      if (element.getOwnedElements().isEmpty()) {
         return List.of();
      }

      return element.getOwnedElements().stream()
         .filter(this::filter)
         .map(elem -> map(elem))
         .collect(Collectors.toList());
   }
}
