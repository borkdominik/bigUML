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
package com.eclipsesource.uml.glsp.uml.features.popup;

import java.util.List;
import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GHtmlRoot;
import org.eclipse.glsp.graph.builder.impl.GHtmlRootBuilder;
import org.eclipse.glsp.graph.builder.impl.GPreRenderedElementBuilder;
import org.eclipse.glsp.server.features.popup.RequestPopupModelAction;

import com.eclipsesource.uml.glsp.core.features.popup.PopupConstants;
import com.eclipsesource.uml.glsp.core.features.popup.PopupMapper;
import com.eclipsesource.uml.modelserver.shared.utils.reflection.GenericsUtil;

public abstract class BasePopupMapper<TElementType extends EObject> implements PopupMapper<TElementType> {
   protected final Class<TElementType> elementType;

   public BasePopupMapper() {
      this.elementType = GenericsUtil.getClassParameter(getClass(), BasePopupMapper.class, 0);
   }

   @Override
   public Class<TElementType> getElementType() { return elementType; }

   @Override
   public Optional<GHtmlRoot> map(final TElementType element, final RequestPopupModelAction action) {
      var bounds = action.getBounds();

      return createRoot(element, action).map(root -> root.id(PopupConstants.ROOT_ID)
         .canvasBounds(bounds).build());
   }

   protected abstract Optional<GHtmlRootBuilder> createRoot(final TElementType element,
      final RequestPopupModelAction action);

   protected GPreRenderedElementBuilder generateTitle(final String code) {
      return new GPreRenderedElementBuilder()
         .id(PopupConstants.TITLE_ID)
         .code(String.format("<div class=\"%s\">%s</div>", PopupConstants.TITLE_CLASS, code));
   }

   protected GPreRenderedElementBuilder generateBody(final String code) {
      return new GPreRenderedElementBuilder()
         .id(PopupConstants.BODY_ID)
         .code(String.format("<div class=\"%s\">%s</div>", PopupConstants.BODY_CLASS, code));
   }

   protected GPreRenderedElementBuilder generateBody(final List<String> code) {
      return new GPreRenderedElementBuilder()
         .id(PopupConstants.BODY_ID)
         .code(String.format("<div class=\"%s\">%s</div>", PopupConstants.BODY_CLASS,
            String.join(PopupConstants.NEW_LINE, code)));
   }
}
