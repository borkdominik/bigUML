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
package com.eclipsesource.uml.glsp.core.gmodel.suffix;

import com.eclipsesource.uml.glsp.core.features.idgenerator.BaseSuffixIdAppender;
import com.google.inject.Inject;

public class HeaderLabelSuffixAppender extends BaseSuffixIdAppender {
   public static final String SUFFIX = HeaderSuffixAppender.SUFFIX + LabelSuffixAppender.SUFFIX;

   @Inject
   private HeaderSuffixAppender headerSuffix;

   @Inject
   private LabelSuffixAppender labelSuffix;

   public HeaderLabelSuffixAppender() {
      super(SUFFIX);
   }

   @Override
   public String appendTo(final String id) {
      return labelSuffix.appendTo(headerSuffix.appendTo(id));
   }

   @Override
   public String clear(final String id) {
      return headerSuffix.clear(labelSuffix.clear(id));
   }
}
