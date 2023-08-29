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
package com.eclipsesource.uml.glsp.uml.elements.class_.features;

import java.util.List;
import java.util.Optional;

import org.eclipse.glsp.graph.builder.impl.GHtmlRootBuilder;
import org.eclipse.glsp.server.features.popup.RequestPopupModelAction;
import org.eclipse.uml2.uml.Class;

import com.eclipsesource.uml.glsp.uml.features.popup.BasePopupMapper;

public class ClassPopupMapper extends BasePopupMapper<Class> {

   @Override
   protected Optional<GHtmlRootBuilder> createRoot(final Class element, final RequestPopupModelAction action) {
      var title = generateTitle(element.getName()).build();
      var body = generateBody(List.of(
         String.format("Attributes: %d",
            element.getOwnedAttributes().stream().filter(p -> p.getAssociation() == null).count()),
         String.format("Operations: %d", element.getOwnedOperations().size()))).build();

      return Optional.of(new GHtmlRootBuilder().addAll(List.of(
         title,
         body)));
   }

}
