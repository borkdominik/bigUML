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
package com.eclipsesource.uml.glsp.uml.elements.control_flow.gmodel.suffix;

import com.eclipsesource.uml.glsp.core.features.id_generator.BaseSuffixIdAppender;

public class WeightLabelSuffix extends BaseSuffixIdAppender {
   public static final String SUFFIX = "_weight_label";

   public WeightLabelSuffix() {
      super(SUFFIX);
   }
}
