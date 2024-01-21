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
package com.eclipsesource.uml.glsp.uml.elements.enumeration.gmodel;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.EnumerationLiteral;

import com.eclipsesource.uml.glsp.core.constants.QuotationMark;
import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCProvider;
import com.eclipsesource.uml.glsp.sdk.cdk.gmodel.GCModelList;
import com.eclipsesource.uml.glsp.sdk.ui.components.list.GCList;
import com.eclipsesource.uml.glsp.sdk.ui.components.list.GCListItem;
import com.eclipsesource.uml.glsp.uml.elements.data_type.gmodel.GDataTypeBuilder;
import com.eclipsesource.uml.glsp.uml.elements.named_element.GCNamedElement;

public final class GEnumerationBuilder<TOrigin extends Enumeration> extends GDataTypeBuilder<TOrigin> {

   public GEnumerationBuilder(final GModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   public List<EnumerationLiteral> enumerationLiterals() {
      return origin.getOwnedLiterals();
   }

   @Override
   protected GCProvider createHeader(final GCModelList<?, ?> container) {
      var namedElementOptions = new GCNamedElement.Options(container);
      namedElementOptions.prefix.add(QuotationMark.quoteDoubleAngle("enumeration"));

      return new GCNamedElement<>(context, origin, namedElementOptions);
   }

   @Override
   protected GCProvider createBody(final GCModelList<?, ?> container) {
      var options = new GCList.Options();
      options.dividerBeforeInserts = true;
      var list = new GCList(context, origin, options);

      list.addAll(enumerationLiterals().stream()
         .map(e -> context.gmodelMapHandler().handle(e))
         .map(e -> new GCListItem(context, origin, e))
         .collect(Collectors.toList()));

      return list;
   }
}
