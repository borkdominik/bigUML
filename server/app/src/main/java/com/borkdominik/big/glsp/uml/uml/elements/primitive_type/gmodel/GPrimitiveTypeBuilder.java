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
package com.borkdominik.big.glsp.uml.uml.elements.primitive_type.gmodel;

import org.eclipse.uml2.uml.PrimitiveType;

import com.borkdominik.big.glsp.server.core.constants.BGQuotationMark;
import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.uml.uml.elements.data_type.gmodel.GDataTypeBuilder;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.GCNamedElement;

public final class GPrimitiveTypeBuilder<TOrigin extends PrimitiveType> extends GDataTypeBuilder<TOrigin> {

   public GPrimitiveTypeBuilder(final GCModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   @Override
   protected GCProvider createHeader(final GCModelList<?, ?> container) {
      var namedElementOptions = GCNamedElement.Options.builder()
         .container(container)
         .prefix(BGQuotationMark.quoteDoubleAngle("primitive"))
         .build();

      return new GCNamedElement<>(context, origin, namedElementOptions);
   }
}
