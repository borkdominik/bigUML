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
package com.eclipsesource.uml.glsp.outline;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.google.inject.Inject;

public class DefaultOutlineGenerator {
   @Inject
   protected UmlModelState modelState;

   public List<OutlineTreeNode> generate() {
      var rootElement = modelState.getSemanticModel();
      List<OutlineTreeNode> outlineTreeNodes = new ArrayList<>();

      var model = modelState.getSemanticModel();

      outlineTreeNodes = model.getOwnedElements().stream()
         .map(rootChildren -> mapElementToOutlineTreeNode(rootChildren))
         .collect(Collectors.toList());

      return outlineTreeNodes;
   }

   private OutlineTreeNode mapElementToOutlineTreeNode(final Element element) {
      var lable = "";
      if (element instanceof NamedElement) {
         lable = ((NamedElement) element).getName();
      } else {
         lable = EcoreUtil.getID(element);
      }
      if (element.getOwnedElements().isEmpty()) {
         return new OutlineTreeNode(lable, EcoreUtil.getURI(element).fragment(), new ArrayList<>(), "method");
      }

      return new OutlineTreeNode(lable, EcoreUtil.getURI(element).fragment(), element.getOwnedElements().stream()
         .map(elem -> mapElementToOutlineTreeNode(elem)).collect(Collectors.toList()), "class");
   }

}
